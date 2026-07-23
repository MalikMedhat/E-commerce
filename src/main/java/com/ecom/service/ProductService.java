package com.ecom.service;

import com.ecom.model.Product;
import com.ecom.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public List<Product> getRelatedProducts(Long id) {
        return productRepository.findById(id)
                .map(product -> productRepository.findByCategoryId(product.getCategory().getId()).stream()
                        .filter(p -> p.getId() != id)
                        .limit(4)
                        .collect(Collectors.toList()))
                .orElse(List.of());
    }

    public List<Product> getByCategoryId(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }
}
