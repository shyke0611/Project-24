package com.example.ai_companion.service;

import com.example.ai_companion.model.CognitiveMessage;
import com.example.ai_companion.model.User;
import com.example.ai_companion.repository.CognitiveMessageRepository;
import com.example.ai_companion.utils.logger;
import dev.langchain4j.model.chat.ChatLanguageModel;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.ai_companion.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

/**
 * Service class for handling cognitive interaction logic and AI responses.
 */
@Service
public class CognitiveAIService {

    @Autowired
    private ChatLanguageModel gemini;

    @Autowired
    private CognitiveMessageRepository cognitiveMessageRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Handles a user query, stores messages, and returns the AI assistant's response.
     *
     * @param userId The user ID.
     * @param question The user’s input message.
     * @return The assistant's generated response.
     */
    public String generateGamePrompt(String userId, String question) {

        // Fetch recent messages for context
        List<CognitiveMessage> recentMessages = cognitiveMessageRepository.findTop10ByUserIdOrderByTimestampDesc(userId);
        StringBuilder context = new StringBuilder();
        for (CognitiveMessage message : recentMessages) {
            if (message.isFromUser()) {
                context.append("User: ").append(message.getText()).append("\n");
            } else {
                context.append("Assistant: ").append(message.getText()).append("\n");
            }
        }

        User user = userRepository.findById(userId).orElse(null);
        String coreInfo = (user != null && user.getCoreInformation() != null) ? user.getCoreInformation() : "none";

        String prompt = """
            You are an AI-powered Cognitive Game Master designed to help elderly users stay mentally sharp and emotionally engaged through gentle, interactive games and playful back-and-forth conversation.
        
            Everything should happen in this chat. Do not suggest activities that involve real-world materials, mobile apps, or leaving the conversation. You are the host and guide — respond with only one specific activity at a time.
        
            Your tone should always be:
            - Friendly, supportive, and warm
            - Simple and clear (no complex words or lists)
            - Cheerful and light, but never childish or condescending
        
            --- USER PROFILE (Background Information) ---
            %s
        
            --- USER INPUT ---
            "%s"
        
            --- RECENT CONTEXT ---
            %s
        
            Based on this, respond with one interactive game, question, or playful challenge that the user can participate in immediately. If the user's message is vague (e.g., "give me something fun"), gently suggest one activity and ask if they’d like that or something else.
        
            Do not:
            - Offer multiple choices
            - Use bullet points or formatting
            - Explain yourself or the goal of the game
            - Repeat the user's input
        
            Just begin the interaction with a friendly and engaging tone. Always assume the user wants to play — unless they say otherwise.
            """.formatted(coreInfo, question, context.toString());

        String response = gemini.chat(prompt);
        logger.logToFile(userId, "CognitiveAI Prompt: " + prompt);
        logger.logToFile(userId, "CognitiveAI Response: " + response);

        CognitiveMessage userMessage = new CognitiveMessage(userId, question, true, Instant.now());
        CognitiveMessage assistantMessage = new CognitiveMessage(userId, response, false, Instant.now());

        cognitiveMessageRepository.save(userMessage);
        cognitiveMessageRepository.save(assistantMessage);

        return response;
    }

}