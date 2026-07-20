package com.ecom.service;

import com.ecom.model.Cart;
import com.ecom.model.CartItem;
import com.ecom.model.Product;
import com.ecom.model.User;
import com.ecom.repository.CartItemRepository;
import com.ecom.repository.CartRepository;
import com.ecom.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashSet;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private CartService cartService;

    private User user;
    private Cart cart;
    private Product product;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");

        cart = new Cart();
        cart.setId(1L);
        cart.setUser(user);
        cart.setItems(new HashSet<>());

        product = new Product();
        product.setId(1L);
        product.setName("Test Product");
        product.setPrice(99.99);
    }

    @Test
    void testGetOrCreateCart_ExistingCart() {
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));

        Cart result = cartService.getOrCreateCart(user);

        assertEquals(cart.getId(), result.getId());
        verify(cartRepository, times(1)).findByUser(user);
        verify(cartRepository, never()).save(any());
    }

    @Test
    void testGetOrCreateCart_NewCart() {
        when(cartRepository.findByUser(user)).thenReturn(Optional.empty());
        when(cartRepository.save(any())).thenReturn(cart);

        Cart result = cartService.getOrCreateCart(user);

        assertNotNull(result);
        verify(cartRepository, times(1)).findByUser(user);
        verify(cartRepository, times(1)).save(any());
    }

    @Test
    void testAddItemToCart_NewItem() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(cartItemRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        CartItem result = cartService.addItemToCart(cart, 1L, 2);

        assertNotNull(result);
        assertEquals(2, result.getQuantity());
        verify(productRepository, times(1)).findById(1L);
        verify(cartItemRepository, times(1)).save(any());
    }

    @Test
    void testAddItemToCart_ProductNotFound() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> cartService.addItemToCart(cart, 1L, 2));
    }

    @Test
    void testRemoveItemFromCart() {
        CartItem cartItem = new CartItem();
        cartItem.setId(1L);

        when(cartItemRepository.findById(1L)).thenReturn(Optional.of(cartItem));

        cartService.removeItemFromCart(cart, 1L);

        verify(cartItemRepository, times(1)).delete(cartItem);
    }

    @Test
    void testUpdateItemQuantity_ValidQuantity() {
        CartItem cartItem = new CartItem();
        cartItem.setId(1L);
        cartItem.setQuantity(2);

        when(cartItemRepository.findById(1L)).thenReturn(Optional.of(cartItem));

        cartService.updateItemQuantity(1L, 5);

        assertEquals(5, cartItem.getQuantity());
        verify(cartItemRepository, times(1)).save(cartItem);
    }

    @Test
    void testUpdateItemQuantity_ZeroQuantity() {
        CartItem cartItem = new CartItem();
        cartItem.setId(1L);

        when(cartItemRepository.findById(1L)).thenReturn(Optional.of(cartItem));

        cartService.updateItemQuantity(1L, 0);

        verify(cartItemRepository, times(1)).delete(cartItem);
    }

    @Test
    void testClearCart() {
        CartItem item1 = new CartItem();
        item1.setId(1L);
        CartItem item2 = new CartItem();
        item2.setId(2L);

        cart.getItems().add(item1);
        cart.getItems().add(item2);

        when(cartRepository.save(any())).thenReturn(cart);

        cartService.clearCart(cart);

        assertTrue(cart.getItems().isEmpty());
        verify(cartItemRepository, times(1)).deleteAll(any());
    }

    @Test
    void testCalculateCartTotal() {
        CartItem item1 = new CartItem();
        item1.setId(1L);
        item1.setProduct(product);
        item1.setQuantity(2);

        CartItem item2 = new CartItem();
        item2.setId(2L);
        Product product2 = new Product();
        product2.setId(2L);
        product2.setPrice(50.0);
        item2.setProduct(product2);
        item2.setQuantity(1);

        cart.getItems().add(item1);
        cart.getItems().add(item2);

        Double total = cartService.calculateCartTotal(cart);

        assertEquals(249.98, total, 0.01);
    }
}
