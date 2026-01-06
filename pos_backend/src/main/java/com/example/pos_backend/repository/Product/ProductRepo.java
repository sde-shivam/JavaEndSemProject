package com.example.pos_backend.repository.Product;


import com.example.pos_backend.modal.Category.Category;
import com.example.pos_backend.modal.Product.Product;
import com.example.pos_backend.modal.User.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepo extends JpaRepository<Product, Long> {
    int countByCategory(Category category);

    List<Product> findByUser(User user);

    List<Product> findByUserAndCategory(User user, Category category);

    boolean existsByNameAndUser(String name, User user);
}
