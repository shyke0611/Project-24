package com.example.ai_companion.controller;

import com.example.ai_companion.model.Message;
import com.example.ai_companion.repository.MessageRepository;
import com.example.ai_companion.service.LLMService;
import com.example.ai_companion.service.MemoryService;
import com.example.ai_companion.utils.logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

/**
 * Controller for handling chat-related actions, including asking questions,
 * introducing users, retrieving chat history, and deleting messages.
 */
@RestController
@RequestMapping("/memory")
public class ChatController {

    @Autowired
    private MemoryService memoryService;

    @Autowired 
    private LLMService llmService;

    @Autowired
    private MessageRepository messageRepository;

    /**
     * Handles a new user question and returns the assistant's response.
     *
     * @param userId   The ID of the user sending the question.
     * @param question The user's message.
     * @return The assistant's response as a plain string.
     */
    @PostMapping("/ask")
    public String ask(@RequestParam String userId, @RequestBody String question) {
        logger.logToFile(userId, "new question");
        return llmService.generateAndTrack(userId, question);
    }

    /**
     * Stores introductory information provided by the user to personalise future responses.
     *
     * @param userId    The ID of the user.
     * @param introText The introduction text provided by the user.
     * @return A confirmation message or an error status.
     */
    @PostMapping("/introduce")
    public ResponseEntity<String> introduce(@RequestParam String userId, @RequestBody String introText) {
        try {
            String fakeAssistantResponse = "Thanks for introducing yourself. I'll remember that.";
            boolean success = memoryService.extractAndStoreInsights(userId, introText, fakeAssistantResponse);

            if (success) {
                return ResponseEntity.ok("Introduction stored.");
            } else {
                return ResponseEntity.status(404).body("User not found. Introduction not saved.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal error during introduction: " + e.getMessage());
        }
    }

    /**
     * Retrieves the 30 most recent messages for the given user, with pagination support.
     *
     * @param userId The ID of the user.
     * @param page   The page number to retrieve (default is 0).
     * @return A list of the user's recent messages, ordered from oldest to newest.
     */
    @GetMapping("/chats")
    public ResponseEntity<List<Message>> getChats(
            @RequestParam String userId,
            @RequestParam(required = false, defaultValue = "0") int page) {

        PageRequest pageRequest = PageRequest.of(page, 30, Sort.by(Sort.Direction.DESC, "timestamp"));
        List<Message> recentMessages = messageRepository.findByUserId(userId, pageRequest);

        // Reverse the list to return in chronological order (oldest → newest)
        Collections.reverse(recentMessages);

        return ResponseEntity.ok(recentMessages);
    }

    /**
     * Deletes a message by its ID.
     *
     * @param id The ID of the message to delete.
     * @return HTTP 204 if successful, or HTTP 404 if the message does not exist.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable String id) {
        if (!messageRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        messageRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}