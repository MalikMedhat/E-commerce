package com.ecom.service;

import com.ecom.model.User;
import com.ecom.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setPassword("hashed_password");
        user.setRole(User.UserRole.CUSTOMER);
    }

    @Test
    void testRegisterUser_Success() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashed_password");
        when(userRepository.save(any())).thenReturn(user);

        User result = authService.registerUser("test@example.com", "password123");

        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
        assertEquals(User.UserRole.CUSTOMER, result.getRole());
        verify(userRepository, times(1)).save(any());
    }

    @Test
    void testRegisterUser_EmailAlreadyExists() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> authService.registerUser("test@example.com", "password123"));
    }

    @Test
    void testLoginUser_Success() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "hashed_password")).thenReturn(true);

        User result = authService.loginUser("test@example.com", "password123");

        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
    }

    @Test
    void testLoginUser_UserNotFound() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> authService.loginUser("test@example.com", "password123"));
    }

    @Test
    void testLoginUser_InvalidPassword() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongpassword", "hashed_password")).thenReturn(false);

        assertThrows(RuntimeException.class, () -> authService.loginUser("test@example.com", "wrongpassword"));
    }

    @Test
    void testGetUserByEmail_Success() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        Optional<User> result = authService.getUserByEmail("test@example.com");

        assertTrue(result.isPresent());
        assertEquals("test@example.com", result.get().getEmail());
    }

    @Test
    void testGetUserByEmail_NotFound() {
        when(userRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

        Optional<User> result = authService.getUserByEmail("notfound@example.com");

        assertFalse(result.isPresent());
    }

    @Test
    void testGetUserById_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        User result = authService.getUserById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void testGetUserById_NotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> authService.getUserById(1L));
    }

    @Test
    void testGenerateToken() {
        when(jwtService.generateToken(user)).thenReturn("token_123");

        String result = authService.generateToken(user);

        assertEquals("token_123", result);
        verify(jwtService, times(1)).generateToken(user);
    }

    @Test
    void testGenerateRefreshToken() {
        when(jwtService.generateRefreshToken(user)).thenReturn("refresh_token_123");

        String result = authService.generateRefreshToken(user);

        assertEquals("refresh_token_123", result);
        verify(jwtService, times(1)).generateRefreshToken(user);
    }
}
