package com.ecom.controller;

import com.ecom.model.Product;
import com.ecom.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/featured")
    public List<Product> getFeaturedProducts() {
        return productService.getAllProducts().stream()
                .limit(6)
                .collect(Collectors.toList());
    }

    @GetMapping("/category/{categoryId}")
    public List<Product> getProductsByCategoryId(@PathVariable Long categoryId) {
        return productService.getByCategoryId(categoryId);
    }

    @GetMapping("/{id}/related")
    public List<Product> getRelatedProducts(@PathVariable Long id) {
        return productService.getRelatedProducts(id);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
