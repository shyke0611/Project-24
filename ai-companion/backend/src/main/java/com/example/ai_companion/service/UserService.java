package com.example.ai_companion.service;

import com.example.ai_companion.model.User;
import com.example.ai_companion.model.UserDTO;
import com.example.ai_companion.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User register(UserDTO dto) {
        if (userRepository.findByUsername(dto.getUsername()) != null) {
            return null;
        }
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        userRepository.save(user);
        return user;
    }

    public User login(UserDTO dto) {
        User user = userRepository.findByUsername(dto.getUsername());
        if (user != null && passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            return user;
        }
        return null;
    }
    
}
