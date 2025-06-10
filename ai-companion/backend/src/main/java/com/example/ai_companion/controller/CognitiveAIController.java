package com.example.ai_companion.controller;

import com.example.ai_companion.model.CognitiveMessage;
import com.example.ai_companion.repository.CognitiveMessageRepository;
import com.example.ai_companion.service.CognitiveAIService;
import com.example.ai_companion.utils.logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;
import java.util.List;

/**
 * Controller for handling cognitive AI interactions focused on game generation and engagement.
 */
@RestController
@RequestMapping("/cognitive")
public class CognitiveAIController {

    @Autowired
    private CognitiveAIService cognitiveAIService;

    @Autowired
    private CognitiveMessageRepository cognitiveMessageRepository;

    /**
     * Handles a user prompt related to cognitive games and returns an AI-generated response.
     *
     * @param userId  The ID of the user.
     * @param prompt  The user's input.
     * @return AI-generated response.
     */
    @PostMapping("/ask")
    public String ask(@RequestParam String userId, @RequestBody String prompt) {
        return cognitiveAIService.generateGamePrompt(userId, prompt);
    }

    /**
     * Retrieves paginated cognitive message history.
     *
     * @param userId The ID of the user.
     * @param page   The page number for pagination.
     * @return List of cognitive interaction messages.
     */
    @GetMapping("/chats")
    public ResponseEntity<List<CognitiveMessage>> getChats(
            @RequestParam String userId,
            @RequestParam(defaultValue = "0") int page) {

        PageRequest pageRequest = PageRequest.of(page, 30, Sort.by(Sort.Direction.DESC, "timestamp"));
        List<CognitiveMessage> messages = cognitiveMessageRepository.findByUserId(userId, pageRequest);

        Collections.reverse(messages); // Ensure chronological order for display
        return ResponseEntity.ok(messages);
    }

    /**
     * Deletes a specific cognitive message by ID.
     *
     * @param id The message ID to delete.
     * @return HTTP 204 if successful, 404 if not found.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable String id) {
        if (!cognitiveMessageRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        cognitiveMessageRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}