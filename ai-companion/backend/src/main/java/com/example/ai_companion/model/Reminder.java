package com.example.ai_companion.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Data
@Document(collection = "reminders")
public class Reminder {

    @Id
    private String id;
    
    private String userId;
    private String message;
    private Instant timestamp;
    private String description;
    private String tag;
    private ReminderStatus status = ReminderStatus.INCOMPLETE;

    public Reminder(String userId, String message, Instant timestamp, String description, String tag) {
        this.userId = userId;
        this.message = message;
        this.timestamp = timestamp;
        this.description = description;
        this.tag = tag; // medication, appointment, event, task, other
        this.status = ReminderStatus.INCOMPLETE;
    }


    public void updateStatus(ReminderStatus newStatus) {
        this.status = newStatus;
    }

    public void updateTimestamp(Instant newTimestamp) {
        this.timestamp = newTimestamp;
    }
    public void updateMessage(String newMessage) {
        this.message = newMessage;
    }
    public void updateDescription(String newDescription) {
        this.description = newDescription;
    }
    public void updateTag(String newTag) {
        this.tag = newTag;
    }

    
}
