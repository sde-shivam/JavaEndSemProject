package com.example.pos_backend.repository.Category;

import com.example.pos_backend.modal.User.User;
import com.example.pos_backend.modal.Category.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepo extends JpaRepository<Category, Long> {

    // get all categories of one user
    List<Category> findByUser(User user);

    // check if category already exists for the user
    boolean existsByNameAndUser(String name, User user);
}
