package com.example.ai_companion.controller;

import com.example.ai_companion.model.UserDTO;
import com.example.ai_companion.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<String> register(@RequestBody UserDTO userDTO) {
        boolean success = userService.register(userDTO);
        if (success) {
            return ResponseEntity.ok("Registered successfully");
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
    public ResponseEntity<String> login(@RequestBody UserDTO userDTO) {
        boolean success = userService.login(userDTO);
        if (success) {
            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
}