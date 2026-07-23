package com.ecom.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.util.Set;
@Entity
@Data
@EqualsAndHashCode(exclude = "products")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id ;
    private String name;

    @OneToMany(mappedBy  = "category",
        cascade = CascadeType.ALL,
        fetch = FetchType.LAZY)
    @JsonBackReference
    private Set<Product> products;

}
