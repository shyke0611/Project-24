package com.example.ai_companion.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * Represents a single cognitive interaction message, either from the user or the AI assistant.
 */
@Data
@Document(collection = "cognitive_messages")
public class CognitiveMessage {

    @Id
    private String id;

    private String userId;
    private String text;
    private boolean fromUser;
    private Instant timestamp;

    public CognitiveMessage(String userId, String text, boolean fromUser, Instant timestamp) {
        this.userId = userId;
        this.text = text;
        this.fromUser = fromUser;
        this.timestamp = timestamp;
    }
}