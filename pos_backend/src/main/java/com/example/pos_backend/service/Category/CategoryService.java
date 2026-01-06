package com.example.pos_backend.service.Category;

import com.example.pos_backend.dto.Category.CategoryRequestDTO;
import com.example.pos_backend.dto.Category.CategoryResponseDTO;

import java.util.List;

public interface CategoryService {
    // Create new category
    CategoryResponseDTO createCategory(CategoryRequestDTO dto, String userEmail);

    // Update existing category
    CategoryResponseDTO updateCategory(Long id, CategoryRequestDTO dto, String userEmail);

    // Delete category
    String deleteCategory(Long id, String userEmail);

    // Get a single category by ID
    CategoryResponseDTO getCategoryById(Long id, String userEmail);

    // Get all categories for the logged-in user
    List<CategoryResponseDTO> getMyCategories(String userEmail);
}
