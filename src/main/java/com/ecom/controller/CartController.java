package com.ecom.controller;

import com.ecom.dto.AddItemToCartDTO;
import com.ecom.dto.CartDTO;
import com.ecom.dto.CartItemDTO;
import com.ecom.dto.UpdateCartItemDTO;
import com.ecom.model.Cart;
import com.ecom.model.CartItem;
import com.ecom.model.User;
import com.ecom.security.JwtAuthenticationToken;
import com.ecom.service.AuthService;
import com.ecom.service.CartService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final AuthService authService;

    public CartController(CartService cartService, AuthService authService) {
        this.cartService = cartService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<?> getCart() {
        Long userId = getCurrentUserId();
        if (userId == null) {
            // Unauthenticated callers (e.g. shop homepage) get an empty cart stub
            return ResponseEntity.ok(new java.util.HashMap<>());
        }
        User user = authService.getUserById(userId);
        Cart cart = cartService.getOrCreateCart(user);

        return ResponseEntity.ok(mapToDTO(cart));
    }

//    @PostMapping("/items")
//    public ResponseEntity<CartItemDTO> addItemToCart(@RequestBody AddItemToCartDTO request) {
//        Long userId = getCurrentUserId();
//        User user = authService.getUserById(userId);
//        Cart cart = cartService.getOrCreateCart(user);
//
//        CartItem item = cartService.addItemToCart(cart, request.getProductId(), request.getQuantity());
//
//        return ResponseEntity.status(HttpStatus.CREATED).body(mapItemToDTO(item));
//    }
@PostMapping("/items")
public ResponseEntity<CartItemDTO> addItemToCart(@RequestBody AddItemToCartDTO request) {

    System.out.println("INSIDE CART CONTROLLER");

    Long userId = getCurrentUserId();
    System.out.println("USER ID = " + userId);

    if (userId == null) {
        // For guest users, create a temporary user or use session-based cart
        // For now, we'll create a guest user
        User guestUser = authService.createGuestUser();
        Cart cart = cartService.getOrCreateCart(guestUser);
        
        CartItem item = cartService.addItemToCart(
                cart,
                request.getProductId(),
                request.getQuantity());

        return ResponseEntity.status(HttpStatus.CREATED).body(mapItemToDTO(item));
    }

    User user = authService.getUserById(userId);
    Cart cart = cartService.getOrCreateCart(user);

    CartItem item = cartService.addItemToCart(
            cart,
            request.getProductId(),
            request.getQuantity());

    return ResponseEntity.status(HttpStatus.CREATED).body(mapItemToDTO(item));
}

    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<CartItemDTO> updateCartItem(
            @PathVariable Long cartItemId,
            @RequestBody UpdateCartItemDTO request) {
        cartService.updateItemQuantity(cartItemId, request.getQuantity());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<Void> removeItemFromCart(@PathVariable Long cartItemId) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            // Guest users can't remove items by ID without proper session management
            // For now, just return success
            return ResponseEntity.noContent().build();
        }
        User user = authService.getUserById(userId);
        Cart cart = cartService.getOrCreateCart(user);

        cartService.removeItemFromCart(cart, cartItemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart() {
        Long userId = getCurrentUserId();
        if (userId == null) {
            // Guest users can't clear cart without proper session management
            return ResponseEntity.noContent().build();
        }
        User user = authService.getUserById(userId);
        Cart cart = cartService.getOrCreateCart(user);

        cartService.clearCart(cart);
        return ResponseEntity.noContent().build();
    }

    private CartDTO mapToDTO(Cart cart) {
        CartDTO dto = new CartDTO();
        dto.setId(cart.getId());
        dto.setTotal(cartService.calculateCartTotal(cart));
        dto.setItems(cart.getItems().stream()
                .map(this::mapItemToDTO)
                .collect(Collectors.toList()));
        return dto;
    }


    private CartItemDTO mapItemToDTO(CartItem item) {
        CartItemDTO dto = new CartItemDTO();
        dto.setId(item.getId());
        dto.setProductId(item.getProduct().getId());
        dto.setProductName(item.getProduct().getName());
        dto.setPrice(item.getProduct().getPrice());
        dto.setQuantity(item.getQuantity());
        dto.setSubtotal(item.getSubtotal());
        return dto;
    }

    private Long getCurrentUserId() {
        try {
            var authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication instanceof JwtAuthenticationToken jwtAuth) {
                return jwtAuth.getUserId();
            }
        } catch (Exception e) {
            // Ignore any authentication errors
        }
        return null;
    }
}
