package com.ecom.controller;

import com.ecom.dto.AuthRequestDTO;
import com.ecom.dto.AuthResponseDTO;
import com.ecom.model.User;
import com.ecom.service.AuthService;
import com.ecom.service.CartService;
import com.ecom.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000/")
public class AuthController {

    private final AuthService authService;
    private final CartService cartService;
    private final JwtService jwtService;

    public AuthController(AuthService authService, CartService cartService, JwtService jwtService) {
        this.authService = authService;
        this.cartService = cartService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@RequestBody AuthRequestDTO request) {
        User user = authService.registerUser(request.getEmail(), request.getPassword());
        cartService.getOrCreateCart(user);

        String token = authService.generateToken(user);
        String refreshToken = authService.generateRefreshToken(user);

        AuthResponseDTO response = new AuthResponseDTO();
        response.setUserId(user.getId());
        response.setEmail(user.getEmail());
        response.setToken(token);
        response.setRefreshToken(refreshToken);
        response.setRole(user.getRole().toString());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody AuthRequestDTO request) {
        User user = authService.loginUser(request.getEmail(), request.getPassword());

        String token = authService.generateToken(user);
        String refreshToken = authService.generateRefreshToken(user);

        AuthResponseDTO response = new AuthResponseDTO();
        response.setUserId(user.getId());
        response.setEmail(user.getEmail());
        response.setToken(token);
        response.setRefreshToken(refreshToken);
        response.setRole(user.getRole().toString());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponseDTO> refreshToken(@RequestHeader("Authorization") String bearerToken) {
        String token = bearerToken.replace("Bearer ", "");
        if (!jwtService.validateToken(token)) {
            throw new RuntimeException("Invalid refresh token");
        }
        Long userId = jwtService.getUserIdFromToken(token);

        User user = authService.getUserById(userId);
        String newToken = authService.generateToken(user);

        AuthResponseDTO response = new AuthResponseDTO();
        response.setUserId(user.getId());
        response.setEmail(user.getEmail());
        response.setToken(newToken);
        response.setRole(user.getRole().toString());

        return ResponseEntity.ok(response);
    }
}
