package com.example.ai_companion.service;

import com.example.ai_companion.model.Message;
import com.example.ai_companion.model.Reminder;
import com.example.ai_companion.model.User;
import com.example.ai_companion.repository.MessageRepository;
import com.example.ai_companion.repository.ReminderRepository;
import com.example.ai_companion.repository.UserRepository;
import com.example.ai_companion.utils.logger;
import dev.langchain4j.model.chat.ChatLanguageModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.time.LocalDate;
import java.util.*;

/**
 * Service responsible for handling AI interactions with the user, including:
 * - Generating contextual responses using LangChain LLM
 * - Retrieving recent messages, user core info, and reminders
 * - Fetching and embedding relevant memories
 * - Persisting interactions and extracted reminders
 */
@Service
public class LLMService {

    @Autowired private ChatLanguageModel chatLanguageModel;
    @Autowired private UserRepository userRepository;
    @Autowired private MessageRepository messageRepository;
    @Autowired private MemoryService memoryService;
    @Autowired private ReminderRepository reminderRepository;
    @Autowired private ReminderService reminderService;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Generates a response to the user's query using context-aware memory and reminder information.
     *
     * @param userId the user ID
     * @param query the user's message
     * @param location the user's location info (may be null)
     * @return the assistant's response
     */
    public String generateAndTrack(String userId, String query, Object location) {
        User user = userRepository.findById(userId).orElse(null);
        String coreInfo = (user != null && user.getCoreInformation() != null) ? user.getCoreInformation() : "none";

        String chatHistory = buildChatHistory(userId);
        String reminderBlock = buildUpcomingRemindersBlock(userId);
        String queryToSearch = generateMemoryQuery(query, chatHistory, coreInfo);
        String memoryContext = fetchMemoryContext(userId, queryToSearch);

        String today = LocalDate.now().toString();
        String prompt = buildLLMPrompt(today, coreInfo, memoryContext, chatHistory, reminderBlock, query, location);
        String responseText = chatLanguageModel.chat(prompt);

        logger.logToFile(userId, "New User Question: " + query);
        logger.logToFile(userId, "LLM refined query: " + queryToSearch);
        logger.logToFile(userId, "LLM Prompt: " + prompt);
        logger.logToFile(userId, "LLM Response " + responseText);

        reminderService.extractReminders(userId, query);

        messageRepository.save(new Message(userId, query, true, Instant.now()));
        messageRepository.save(new Message(userId, responseText, false, Instant.now()));

        new Thread(() -> memoryService.extractAndStoreInsights(userId, query, responseText)).start();

        return responseText;
    }

    /** Builds the user's last 10 messages in chronological order. */
    private String buildChatHistory(String userId) {
        List<Message> messages = messageRepository.findTop10ByUserIdOrderByTimestampDesc(userId);
        messages.sort(Comparator.comparing(Message::getTimestamp));
        StringBuilder sb = new StringBuilder();
        for (Message m : messages) {
            sb.append(m.isFromUser() ? "User: " : "Assistant: ")
              .append(m.getText()).append("\n");
        }
        return sb.toString().trim();
    }

    /** Builds a block summarising the user's next 10 reminders. */
    private String buildUpcomingRemindersBlock(String userId) {
        List<Reminder> reminders = reminderRepository.findTop10ByUserIdAndTimestampGreaterThanOrderByTimestampAsc(userId, Instant.now());
        if (reminders.isEmpty()) return "none";

        StringBuilder sb = new StringBuilder();
        for (Reminder r : reminders) {
            sb.append("Title: ").append(r.getMessage()).append("\n")
              .append("Description: ").append(r.getDescription()).append("\n")
              .append("Due: ").append(r.getTimestamp()).append("\n\n");
        }
        return sb.toString().trim();
    }

    /** Fetches memory context from the memory embedding service. */
    private String fetchMemoryContext(String userId, String query) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            Map<String, Object> body = new HashMap<>();
            body.put("user_id", userId);
            body.put("query", query);
            body.put("top_k", 5);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                "http://localhost:8000/recall",
                HttpMethod.POST,
                request,
                new org.springframework.core.ParameterizedTypeReference<>() {}
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                if (responseBody != null) {
                    Object memories = responseBody.get("related_memories");
                    return memories != null ? memories.toString() : "none";
                }
                return "none";
            }
        } catch (Exception e) {
            System.err.println("Failed to retrieve memory context: " + e.getMessage());
        }
        return "none";
    }

        /** Builds a prompt to convert the user's question into a memory search query. */
        private String generateMemoryQuery(String query, String chatHistory, String coreInfo) {
            String prompt = """
                You are a memory assistant. Your job is to convert the user's current message into a memory-style search query.
    
                The user's message is:
                "%s"
    
                These are the last 10 messages in the conversation:
                %s
    
                The user's long-term core information is:
                %s
    
                Create a concise sentence that best represents the kind of memory that would be relevant to this message, using the same structure as stored memory sentences.
    
                Memory entries typically describe:
                - Specific past events or experiences
                - Short-term goals or plans
                - Emotions or reactions
    
                Your output should be a single memory-style sentence. If nothing is relevant, return "none".
                """.formatted(query, chatHistory, coreInfo);
            return chatLanguageModel.chat(prompt);
        }

    /** Builds the final prompt sent to the LLM. */
    private String buildLLMPrompt(String today, String coreInfo, String memoryContext, String chatHistory, String reminders, String query, Object location) {
        String locationBlock = "none";
        if (location != null) {
            locationBlock = location.toString();
        }
        return """
            Today is %s.
            You are a personalised virtual assistant designed for elderly care. Your role is to respond supportively and clearly, considering the user's health, personal background, daily context, and emotional needs.

            --- USER PROFILE (Long-Term Core Info) ---
            %s

            --- RECENT MEMORIES (Contextual Events) ---
            %s

            --- CHAT HISTORY (Recent Conversation) ---
            %s

            --- UPCOMING REMINDERS (Tasks to Remember, include time if needed) ---
            %s

            --- USER LOCATION (If available) ---
            %s

            --- USER QUESTION ---
            The user said: "%s"

            Respond in a way that shows:
            • Kindness and patience
            • Clear and simple language (suitable for older adults)
            • Lighthearted charm
            • No technical jargon
            • Use the user's location to provide relevant information if necessary 
            • Do not use emojis
            • Write in warm, engaging, natural-sounding language.
            """.formatted(today, coreInfo, memoryContext, chatHistory, reminders, locationBlock, query);
    }
}