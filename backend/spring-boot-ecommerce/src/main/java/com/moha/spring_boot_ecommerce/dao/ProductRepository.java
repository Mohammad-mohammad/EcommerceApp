package com.moha.spring_boot_ecommerce.dao;

import com.moha.spring_boot_ecommerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
