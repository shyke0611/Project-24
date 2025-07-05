package com.example.ai_companion.controller;

import com.example.ai_companion.model.Location;
import com.example.ai_companion.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/locations")
public class LocationController {
    @Autowired
    private LocationService locationService;

    @PostMapping
    public ResponseEntity<Location> saveLocation(@RequestBody Map<String, Object> payload) {
        String userId = (String) payload.get("userId");
        double latitude = ((Number) payload.get("latitude")).doubleValue();
        double longitude = ((Number) payload.get("longitude")).doubleValue();
        Instant timestamp = payload.containsKey("timestamp") ? Instant.parse((String) payload.get("timestamp")) : Instant.now();
        Location saved = locationService.saveLocation(userId, latitude, longitude, timestamp);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Location>> getUserLocations(
            @RequestParam String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Location> locationPage = locationService.getUserLocations(userId, pageable);
        return ResponseEntity.ok(locationPage.getContent());
    }
}
