package com.example.pos_backend.implement.Category;


import com.example.pos_backend.dto.Category.CategoryRequestDTO;
import com.example.pos_backend.dto.Category.CategoryResponseDTO;

import com.example.pos_backend.modal.Category.Category;
import com.example.pos_backend.modal.User.User;
import com.example.pos_backend.repository.Category.CategoryRepo;
import com.example.pos_backend.repository.Product.ProductRepo;
import com.example.pos_backend.repository.User.UserRepo;
import com.example.pos_backend.service.Category.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryImpliment implements CategoryService {

    private final UserRepo userRepo;
    private final CategoryRepo categoryRepo;
    private final ProductRepo productRepo;

    public CategoryImpliment(UserRepo userRepo, CategoryRepo categoryRepo, ProductRepo productRepo) {
        this.userRepo = userRepo;
        this.categoryRepo = categoryRepo;
        this.productRepo = productRepo;
    }

    // ------------------------------------------------------------
    // CREATE CATEGORY
    // ------------------------------------------------------------
    @Override
    public CategoryResponseDTO createCategory(CategoryRequestDTO dto, String userEmail) {

        User user = userRepo.findByemail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (categoryRepo.existsByNameAndUser(dto.getName(), user)) {
            throw new RuntimeException("Category already exists");
        }

        Category category = new Category();
        category.setUser(user);
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        category.setBgColor(dto.getBgColor());

        Category saved = categoryRepo.save(category);

        int itemCount = productRepo.countByCategory(saved);

        return new CategoryResponseDTO(
                saved.getId(),
                saved.getName(),
                saved.getDescription(),
                saved.getBgColor(),
                itemCount,
                saved.getCreatedAt().toString(),
                saved.getUpdatedAt().toString()
        );
    }

    // ------------------------------------------------------------
    // UPDATE CATEGORY
    // ------------------------------------------------------------
    @Override
    public CategoryResponseDTO updateCategory(Long id, CategoryRequestDTO dto, String userEmail) {

        User user = userRepo.findByemail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category = categoryRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (!category.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You cannot update another user's category");
        }

        // SMART UPDATE (only change fields if not empty)
        if (dto.getName() != null && !dto.getName().trim().isEmpty()) {
            category.setName(dto.getName());
        }

        if (dto.getDescription() != null && !dto.getDescription().trim().isEmpty()) {
            category.setDescription(dto.getDescription());
        }

        if (dto.getBgColor() != null && !dto.getBgColor().trim().isEmpty()) {
            category.setBgColor(dto.getBgColor());
        }

        Category updated = categoryRepo.save(category);

        int itemCount = productRepo.countByCategory(updated);

        return new CategoryResponseDTO(
                updated.getId(),
                updated.getName(),
                updated.getDescription(),
                updated.getBgColor(),
                itemCount,
                updated.getCreatedAt().toString(),
                updated.getUpdatedAt().toString()
        );
    }

    // ------------------------------------------------------------
    // DELETE CATEGORY
    // ------------------------------------------------------------
    @Override
    public String deleteCategory(Long id, String userEmail) {

        User user = userRepo.findByemail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category = categoryRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (!category.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You cannot delete another user's category");
        }

        categoryRepo.delete(category);

        return "Category deleted successfully";
    }

    // ------------------------------------------------------------
    // GET SINGLE CATEGORY BY ID
    // ------------------------------------------------------------
    @Override
    public CategoryResponseDTO getCategoryById(Long id, String userEmail) {

        Category category = categoryRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (!category.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized access");
        }

        int itemCount = productRepo.countByCategory(category);

        return new CategoryResponseDTO(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getBgColor(),
                itemCount,
                category.getCreatedAt().toString(),
                category.getUpdatedAt().toString()
        );
    }

    // ------------------------------------------------------------
    // GET ALL CATEGORIES OF LOGGED-IN USER
    // ------------------------------------------------------------
    @Override
    public List<CategoryResponseDTO> getMyCategories(String userEmail) {

        User user = userRepo.findByemail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Category> categories = categoryRepo.findByUser(user);

        return categories.stream()
                .map(category -> new CategoryResponseDTO(
                        category.getId(),
                        category.getName(),
                        category.getDescription(),
                        category.getBgColor(),
                        productRepo.countByCategory(category),
                        category.getCreatedAt().toString(),
                        category.getUpdatedAt().toString()
                ))
                .toList();
    }
}
