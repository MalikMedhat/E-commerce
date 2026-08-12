package com.ecom.config;

import com.ecom.model.Category;
import com.ecom.model.Product;
import com.ecom.repository.CategoryRepository;
import com.ecom.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public DataSeeder(ProductRepository productRepository,
                      CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) throws Exception {

        productRepository.deleteAll();
        categoryRepository.deleteAll();

        Category electronics = new Category();
        electronics.setName("Electronics");

        Category clothing = new Category();
        clothing.setName("Clothing");

        categoryRepository.saveAll(Arrays.asList(
                electronics,
                clothing
        ));

        Product phone = new Product();
        phone.setName("Smartphone");
        phone.setDescription("Latest smartphone with a premium display and advanced features");
        phone.setImageUrl(
                "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&h=600&fit=crop"
        );
        phone.setPrice(599.99);
        phone.setCategory(electronics);

        Product laptop = new Product();
        laptop.setName("Premium Laptop");
        laptop.setDescription("High-performance laptop designed for work, study and entertainment");
        laptop.setImageUrl(
                "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop"
        );
        laptop.setPrice(899.99);
        laptop.setCategory(electronics);

        Product blender = new Product();
        blender.setName("Premium Blender");
        blender.setDescription("High-speed blender perfect for smoothies and everyday cooking");
        blender.setImageUrl(
                "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&h=600&fit=crop"
        );
        blender.setPrice(79.99);
        blender.setCategory(electronics);

        Product headphones = new Product();
        headphones.setName("Wireless Headphones");
        headphones.setDescription("Premium noise-cancelling headphones with up to 30 hours of battery life");
        headphones.setImageUrl(
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop"
        );
        headphones.setPrice(249.99);
        headphones.setCategory(electronics);

        Product watch = new Product();
        watch.setName("Smart Watch");
        watch.setDescription("Modern smartwatch with fitness tracking, GPS and health monitoring");
        watch.setImageUrl(
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop"
        );
        watch.setPrice(199.99);
        watch.setCategory(electronics);

        Product camera = new Product();
        camera.setName("DSLR Camera");
        camera.setDescription("Professional DSLR camera with high-resolution image quality");
        camera.setImageUrl(
                "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop"
        );
        camera.setPrice(749.99);
        camera.setCategory(electronics);

        // NEW PRODUCT 1
        Product keyboard = new Product();
        keyboard.setName("Mechanical Keyboard");
        keyboard.setDescription("Premium mechanical keyboard with a modern minimalist design");
        keyboard.setImageUrl(
                "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop"
        );
        keyboard.setPrice(119.99);
        keyboard.setCategory(electronics);

        // NEW PRODUCT 2
        Product mouse = new Product();
        mouse.setName("Wireless Mouse");
        mouse.setDescription("Ergonomic wireless mouse with precision tracking and modern design");
        mouse.setImageUrl(
                "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&h=600&fit=crop"
        );
        mouse.setPrice(59.99);
        mouse.setCategory(electronics);

        // NEW PRODUCT 3
        Product tablet = new Product();
        tablet.setName("Modern Tablet");
        tablet.setDescription("Slim high-resolution tablet for entertainment, study and productivity");
        tablet.setImageUrl(
                "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop"
        );
        tablet.setPrice(449.99);
        tablet.setCategory(electronics);

        Product jacket = new Product();
        jacket.setName("Winter Jacket");
        jacket.setDescription("Warm and stylish winter jacket designed for cold weather");
        jacket.setImageUrl(
                "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop"
        );
        jacket.setPrice(399.99);
        jacket.setCategory(clothing);

        Product sneakers = new Product();
        sneakers.setName("Running Sneakers");
        sneakers.setDescription("Lightweight and comfortable sneakers for running and everyday use");
        sneakers.setImageUrl(
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop"
        );
        sneakers.setPrice(129.99);
        sneakers.setCategory(clothing);

        Product backpack = new Product();
        backpack.setName("Travel Backpack");
        backpack.setDescription("Durable 40L backpack with a dedicated laptop compartment");
        backpack.setImageUrl(
                "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop"
        );
        backpack.setPrice(89.99);
        backpack.setCategory(clothing);

        // NEW PRODUCT 4
        Product sunglasses = new Product();
        sunglasses.setName("Premium Sunglasses");
        sunglasses.setDescription("Modern sunglasses with a stylish frame and premium look");
        sunglasses.setImageUrl(
                "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop"
        );
        sunglasses.setPrice(149.99);
        sunglasses.setCategory(clothing);

        productRepository.saveAll(Arrays.asList(
                phone,
                laptop,
                blender,
                headphones,
                watch,
                camera,
                keyboard,
                mouse,
                tablet,
                jacket,
                sneakers,
                backpack,
                sunglasses
        ));
    }
}



