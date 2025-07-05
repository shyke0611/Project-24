package com.example.ai_companion.controller;

import com.example.ai_companion.model.UserDTO;
import com.example.ai_companion.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.ai_companion.model.User;

/**
 * Controller responsible for user authentication operations such as registration and login.
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    /**
     * Registers a new user.
     *
     * @param userDTO The user data containing username and password.
     * @return HTTP 200 if registration is successful, or HTTP 409 if the user already exists.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO userDTO) {
        User user = userService.register(userDTO);
        if (user != null) {
            return ResponseEntity.ok(new UserDTOResponse(user.getId(), user.getUsername()));
        } else {
            return ResponseEntity.status(409).body("User already exists");
        }
    }

    /**
     * Logs in an existing user.
     *
     * @param userDTO The user credentials containing username and password.
     * @return HTTP 200 if login is successful, or HTTP 401 if credentials are invalid.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO userDTO) {
        User user = userService.login(userDTO);
        if (user != null) {
            return ResponseEntity.ok(new UserDTOResponse(user.getId(), user.getUsername()));
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    // DTO for returning user id and username
    public static class UserDTOResponse {
        public String id;
        public String username;
        public UserDTOResponse(String id, String username) {
            this.id = id;
            this.username = username;
        }
    }
}