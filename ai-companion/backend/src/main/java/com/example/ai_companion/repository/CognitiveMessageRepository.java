package com.example.ai_companion.repository;

import com.example.ai_companion.model.CognitiveMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for retrieving cognitive messages from MongoDB.
 */
@Repository
public interface CognitiveMessageRepository extends MongoRepository<CognitiveMessage, String> {

    List<CognitiveMessage> findByUserId(String userId);
    List<CognitiveMessage> findTop10ByUserIdOrderByTimestampDesc(String userId);
    List<CognitiveMessage> findByUserId(String userId, Pageable pageable);
}