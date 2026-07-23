package com.ecom.security;

import com.ecom.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

//    @Override
//    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
//            throws ServletException, IOException {
//        String token = extractTokenFromRequest(request);
//
//        if (token != null && jwtService.validateToken(token)) {
//            Long userId = jwtService.getUserIdFromToken(token);
//            String email = jwtService.getEmailFromToken(token);
//
//            JwtAuthenticationToken authentication = new JwtAuthenticationToken(userId, email);
//            SecurityContextHolder.getContext().setAuthentication(authentication);
//        }
//
//        filterChain.doFilter(request, response);
//    }
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println("========== JWT FILTER ==========");
        System.out.println(request.getMethod() + " " + request.getRequestURI());

        String token = extractTokenFromRequest(request);

        System.out.println("Token = " + token);

        if (token != null) {
            System.out.println("Valid = " + jwtService.validateToken(token));

            if (jwtService.validateToken(token)) {

                Long userId = jwtService.getUserIdFromToken(token);
                String email = jwtService.getEmailFromToken(token);

                System.out.println("User = " + userId);

                JwtAuthenticationToken authentication =
                        new JwtAuthenticationToken(userId, email);

                SecurityContextHolder.getContext().setAuthentication(authentication);

                System.out.println("Authentication SET");
            }
        }

        filterChain.doFilter(request, response);
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
