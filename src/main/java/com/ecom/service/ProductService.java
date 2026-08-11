package com.ecom.service;

import com.ecom.model.Product;
import com.ecom.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getFeaturedProducts() {
        List<Product> allProducts = productRepository.findAll();
        return allProducts.size() > 4 ? allProducts.subList(0, 4) : allProducts;
    }

    public List<Product> getByCategoryId(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public List<Product> getRelatedProducts(Long productId) {
        Product product = getProductById(productId);
        List<Product> categoryProducts = productRepository.findByCategoryId(product.getCategory().getId());
        return categoryProducts.stream()
                .filter(p -> p.getId() != productId)
                .toList();
    }
}
