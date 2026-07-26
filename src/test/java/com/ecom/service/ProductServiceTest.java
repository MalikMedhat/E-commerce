package com.ecom.service;

import com.ecom.model.Product;
import com.ecom.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product product1;
    private Product product2;

    @BeforeEach
    void setUp() {
        product1 = new Product();
        product1.setId(1L);
        product1.setName("Laptop");

        product2 = new Product();
        product2.setId(2L);
        product2.setName("Mouse");
    }

    @Test
    void getAllProducts_returnsAllProducts() {
        when(productRepository.findAll()).thenReturn(Arrays.asList(product1, product2));

        List<Product> result = productService.getAllProducts();

        assertEquals(2, result.size());
        assertEquals("Laptop", result.get(0).getName());
        verify(productRepository).findAll();
    }

    @Test
    void getAllProducts_whenNoProducts_returnsEmptyList() {
        when(productRepository.findAll()).thenReturn(Collections.emptyList());

        List<Product> result = productService.getAllProducts();

        assertTrue(result.isEmpty());
    }

    @Test
    void getByCategoryId_returnsMatchingProducts() {
        Long categoryId = 5L;
        when(productRepository.findByCategoryId(categoryId)).thenReturn(List.of(product1));

        List<Product> result = productService.getByCategoryId(categoryId);

        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getId());
        verify(productRepository).findByCategoryId(categoryId);
    }

    @Test
    void getByCategoryId_whenNoMatch_returnsEmptyList() {
        Long categoryId = 99L;
        when(productRepository.findByCategoryId(categoryId)).thenReturn(Collections.emptyList());

        List<Product> result = productService.getByCategoryId(categoryId);

        assertTrue(result.isEmpty());
        verify(productRepository).findByCategoryId(categoryId);
    }
}
