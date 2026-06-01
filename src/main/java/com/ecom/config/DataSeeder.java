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

    public DataSeeder(ProductRepository productRepository, CategoryRepository categoryRepository) {
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

        categoryRepository.saveAll(Arrays.asList(electronics, clothing));

//        Product phone = new Product();
//        phone.setName("SmartPhone");
//        phone.setDescription("Latest model with advanced features");
//        phone.setImageUrl("https://placehold.co/300x250");
//        phone.setPrice(599.99);
//        phone.setCategory(electronics);
//
//        Product laptop = new Product();
//        laptop.setName("Laptop");
//        laptop.setDescription("Business laptop with high performance");
//        laptop.setImageUrl("https://placehold.co/300x250");
//        laptop.setPrice(899.99);
//        laptop.setCategory(electronics);
//
//        Product jacket = new Product();
//        jacket.setName("Winter Jacket");
//        jacket.setDescription("Warm and stylish winter jacket");
//        jacket.setImageUrl("https://placehold.co/300x250");
//        jacket.setPrice(399.99);
//        jacket.setCategory(clothing);
//
//        Product blender = new Product();
//        blender.setName("Blender");
//        blender.setDescription("High-speed blender for smoothies and soups");
//        blender.setImageUrl("https://placehold.co/300x250");
//        blender.setPrice(79.99);
//        blender.setCategory(electronics);
//
//        productRepository.saveAll(Arrays.asList(phone, laptop, jacket, blender));
        Product phone = new Product();
        phone.setName("SmartPhone");
        phone.setDescription("Latest model with advanced features");
        phone.setImageUrl("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=250&fit=crop");
        phone.setPrice(599.99);
        phone.setCategory(electronics);

        Product laptop = new Product();
        laptop.setName("Laptop");
        laptop.setDescription("Business laptop with high performance");
        laptop.setImageUrl("https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=250&fit=crop");
        laptop.setPrice(899.99);
        laptop.setCategory(electronics);

        Product jacket = new Product();
        jacket.setName("Winter Jacket");
        jacket.setDescription("Warm and stylish winter jacket");
        jacket.setImageUrl("https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=250&fit=crop");
        jacket.setPrice(399.99);
        jacket.setCategory(clothing);

        Product blender = new Product();
        blender.setName("Blender");
        blender.setDescription("High-speed blender for smoothies and soups");
        blender.setImageUrl("https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=300&h=250&fit=crop");
        blender.setPrice(79.99);
        blender.setCategory(electronics);

// ── 5 New Products ──

        Product headphones = new Product();
        headphones.setName("Wireless Headphones");
        headphones.setDescription("Noise-cancelling over-ear headphones with 30hr battery");
        headphones.setImageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=250&fit=crop");
        headphones.setPrice(249.99);
        headphones.setCategory(electronics);

        Product sneakers = new Product();
        sneakers.setName("Running Sneakers");
        sneakers.setDescription("Lightweight and comfortable shoes for everyday running");
        sneakers.setImageUrl("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=250&fit=crop");
        sneakers.setPrice(129.99);
        sneakers.setCategory(clothing);

        Product watch = new Product();
        watch.setName("Smart Watch");
        watch.setDescription("Fitness tracker with heart rate monitor and GPS");
        watch.setImageUrl("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=250&fit=crop");
        watch.setPrice(199.99);
        watch.setCategory(electronics);

        Product backpack = new Product();
        backpack.setName("Travel Backpack");
        backpack.setDescription("Durable 40L backpack with laptop compartment");
        backpack.setImageUrl("https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=250&fit=crop");
        backpack.setPrice(89.99);
        backpack.setCategory(clothing);

        Product camera = new Product();
        camera.setName("DSLR Camera");
        camera.setDescription("24MP DSLR camera with 18-55mm kit lens");
        camera.setImageUrl("https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=250&fit=crop");
        camera.setPrice(749.99);
        camera.setCategory(electronics);

        productRepository.saveAll(Arrays.asList(
                phone, laptop, jacket, blender,
                headphones, sneakers, watch, backpack, camera
        ));
    }
}
