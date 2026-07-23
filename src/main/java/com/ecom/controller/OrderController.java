package com.ecom.controller;

import com.ecom.dto.OrderItemDTO;
import com.ecom.dto.OrderResponseDTO;
import com.ecom.model.Order;
import com.ecom.model.User;
import com.ecom.security.JwtAuthenticationToken;
import com.ecom.service.AuthService;
import com.ecom.service.CartService;
import com.ecom.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final CartService cartService;
    private final AuthService authService;

    public OrderController(OrderService orderService, CartService cartService, AuthService authService) {
        this.orderService = orderService;
        this.cartService = cartService;
        this.authService = authService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponseDTO> checkout() {
        Long userId = getCurrentUserId();
        
        if (userId == null) {
            // For guest users, create a guest user
            User guestUser = authService.createGuestUser();
            Order order = orderService.createOrderFromCart(guestUser, cartService.getOrCreateCart(guestUser));
            return ResponseEntity.status(HttpStatus.CREATED).body(mapToDTO(order));
        }
        
        User user = authService.getUserById(userId);
        Order order = orderService.createOrderFromCart(user, cartService.getOrCreateCart(user));

        return ResponseEntity.status(HttpStatus.CREATED).body(mapToDTO(order));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponseDTO>> getOrderHistory() {
        Long userId = getCurrentUserId();
        
        if (userId == null) {
            // Guest users have no order history
            return ResponseEntity.ok(List.of());
        }
        
        User user = authService.getUserById(userId);

        List<Order> orders = orderService.getUserOrderHistory(user);
        List<OrderResponseDTO> response = orders.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponseDTO> getOrder(@PathVariable Long orderId) {
        Order order = orderService.getOrderById(orderId);
        return ResponseEntity.ok(mapToDTO(order));
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<OrderResponseDTO> cancelOrder(@PathVariable Long orderId) {
        orderService.cancelOrder(orderId);
        Order order = orderService.getOrderById(orderId);
        return ResponseEntity.ok(mapToDTO(order));
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderResponseDTO> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {
        Order.OrderStatus newStatus = Order.OrderStatus.valueOf(status);
        orderService.updateOrderStatus(orderId, newStatus);
        Order order = orderService.getOrderById(orderId);
        return ResponseEntity.ok(mapToDTO(order));
    }

    private OrderResponseDTO mapToDTO(Order order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setId(order.getId());
        dto.setStatus(order.getStatus().toString());
        dto.setTotal(order.getTotal());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setItems(order.getItems().stream()
                .map(item -> {
                    OrderItemDTO itemDto = new OrderItemDTO();
                    itemDto.setId(item.getId());
                    itemDto.setProductId(item.getProductId());
                    itemDto.setProductName(item.getProductName());
                    itemDto.setPriceAtPurchase(item.getPriceAtPurchase());
                    itemDto.setQuantity(item.getQuantity());
                    itemDto.setSubtotal(item.getSubtotal());
                    return itemDto;
                })
                .collect(Collectors.toList()));
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
