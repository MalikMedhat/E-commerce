package com.ecom.service;

import com.ecom.model.*;
import com.ecom.repository.OrderItemRepository;
import com.ecom.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private CartService cartService;

    @InjectMocks
    private OrderService orderService;

    private User user;
    private Cart cart;
    private Order order;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");

        cart = new Cart();
        cart.setId(1L);
        cart.setUser(user);

        CartItem item = new CartItem();
        item.setId(1L);
        Product product = new Product();
        product.setId(1L);
        product.setName("Test Product");
        product.setPrice(99.99);
        item.setProduct(product);
        item.setQuantity(2);

        cart.setItems(new HashSet<>(Arrays.asList(item)));

        order = new Order();
        order.setId(1L);
        order.setUser(user);
        order.setStatus(Order.OrderStatus.PENDING);
        order.setTotal(199.98);
    }

    @Test
    void testCreateOrderFromCart_Success() {
        when(orderRepository.save(any())).thenReturn(order);
        when(orderItemRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(cartService.calculateCartTotal(cart)).thenReturn(199.98);

        Order result = orderService.createOrderFromCart(user, cart);

        assertNotNull(result);
        assertEquals(Order.OrderStatus.PENDING, result.getStatus());
        assertEquals(199.98, result.getTotal());
        verify(orderRepository, times(2)).save(any());
        verify(cartService, times(1)).clearCart(cart);
    }

    @Test
    void testCreateOrderFromCart_EmptyCart() {
        cart.setItems(new HashSet<>());

        assertThrows(RuntimeException.class, () -> orderService.createOrderFromCart(user, cart));
    }

    @Test
    void testGetOrderById_Success() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        Order result = orderService.getOrderById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void testGetOrderById_NotFound() {
        when(orderRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> orderService.getOrderById(1L));
    }

    @Test
    void testGetUserOrderHistory() {
        Order order2 = new Order();
        order2.setId(2L);
        order2.setUser(user);

        when(orderRepository.findByUserOrderByCreatedAtDesc(user))
                .thenReturn(Arrays.asList(order2, order));

        List<Order> result = orderService.getUserOrderHistory(user);

        assertEquals(2, result.size());
        verify(orderRepository, times(1)).findByUserOrderByCreatedAtDesc(user);
    }

    @Test
    void testUpdateOrderStatus() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any())).thenReturn(order);

        orderService.updateOrderStatus(1L, Order.OrderStatus.PAID);

        assertEquals(Order.OrderStatus.PAID, order.getStatus());
        verify(orderRepository, times(1)).save(order);
    }

    @Test
    void testCancelOrder_Pending() {
        order.setStatus(Order.OrderStatus.PENDING);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any())).thenReturn(order);

        orderService.cancelOrder(1L);

        assertEquals(Order.OrderStatus.CANCELLED, order.getStatus());
        verify(orderRepository, times(1)).save(order);
    }

    @Test
    void testCancelOrder_Shipped() {
        order.setStatus(Order.OrderStatus.SHIPPED);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        assertThrows(RuntimeException.class, () -> orderService.cancelOrder(1L));
    }

    @Test
    void testCancelOrder_Delivered() {
        order.setStatus(Order.OrderStatus.DELIVERED);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        assertThrows(RuntimeException.class, () -> orderService.cancelOrder(1L));
    }
}
