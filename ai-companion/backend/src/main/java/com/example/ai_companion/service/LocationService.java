package com.example.ai_companion.service;

import com.example.ai_companion.model.Location;
import com.example.ai_companion.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class LocationService {
    @Autowired
    private LocationRepository locationRepository;

    public Location saveLocation(String userId, double latitude, double longitude, Instant timestamp) {
        Location location = new Location(userId, latitude, longitude, timestamp);
        return locationRepository.save(location);
    }

    public List<Location> getUserLocations(String userId) {
        return locationRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    public Page<Location> getUserLocations(String userId, Pageable pageable) {
        return locationRepository.findByUserIdOrderByTimestampDesc(userId, pageable);
    }
}
