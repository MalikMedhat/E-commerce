package com.ecom.service;

import com.ecom.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.SecretKey;

import static org.junit.jupiter.api.Assertions.*;

public class JwtServiceTest {

    private JwtService jwtService;
    private User user;
    private String secretKey = "mySecretKeyForJwtTokenGenerationAndValidationPurposeOnlyForDevelopment";
    private long expiration = 86400000;
    private long refreshExpiration = 604800000;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", secretKey);
        ReflectionTestUtils.setField(jwtService, "expiration", expiration);
        ReflectionTestUtils.setField(jwtService, "refreshExpiration", refreshExpiration);

        user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setRole(User.UserRole.CUSTOMER);
    }

    @Test
    void testGenerateToken_Success() {
        String token = jwtService.generateToken(user);

        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(jwtService.validateToken(token));
    }

    @Test
    void testGenerateToken_ContainsCorrectClaims() {
        String token = jwtService.generateToken(user);

        Long userId = jwtService.getUserIdFromToken(token);
        String email = jwtService.getEmailFromToken(token);

        assertEquals(1L, userId);
        assertEquals("test@example.com", email);
    }

    @Test
    void testGenerateRefreshToken_Success() {
        String token = jwtService.generateRefreshToken(user);

        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(jwtService.validateToken(token));
    }

    @Test
    void testGetUserIdFromToken_Success() {
        String token = jwtService.generateToken(user);

        Long userId = jwtService.getUserIdFromToken(token);

        assertEquals(1L, userId);
    }

    @Test
    void testGetEmailFromToken_Success() {
        String token = jwtService.generateToken(user);

        String email = jwtService.getEmailFromToken(token);

        assertEquals("test@example.com", email);
    }

    @Test
    void testValidateToken_Valid() {
        String token = jwtService.generateToken(user);

        boolean isValid = jwtService.validateToken(token);

        assertTrue(isValid);
    }

    @Test
    void testValidateToken_Invalid() {
        String invalidToken = "invalid.token.here";

        boolean isValid = jwtService.validateToken(invalidToken);

        assertFalse(isValid);
    }

    @Test
    void testValidateToken_MalformedToken() {
        String malformedToken = "malformed";

        boolean isValid = jwtService.validateToken(malformedToken);

        assertFalse(isValid);
    }

    @Test
    void testTokenExpiration() throws InterruptedException {
        ReflectionTestUtils.setField(jwtService, "expiration", 100L);
        String token = jwtService.generateToken(user);

        Thread.sleep(150);

        boolean isValid = jwtService.validateToken(token);

        assertFalse(isValid);
    }

    @Test
    void testDifferentUsersHaveDifferentTokens() {
        User user2 = new User();
        user2.setId(2L);
        user2.setEmail("test2@example.com");
        user2.setRole(User.UserRole.ADMIN);

        String token1 = jwtService.generateToken(user);
        String token2 = jwtService.generateToken(user2);

        assertNotEquals(token1, token2);
        assertEquals(1L, jwtService.getUserIdFromToken(token1));
        assertEquals(2L, jwtService.getUserIdFromToken(token2));
    }
}
