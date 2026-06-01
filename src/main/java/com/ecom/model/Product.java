package com.ecom.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Data
public class Product {
    @Id
    @GeneratedValue
    private long id ;
    private String name;
    private String description;
    private Double price;
    private String imageUrl;
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    @JsonManagedReference
    private Category category;
}
