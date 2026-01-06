package com.example.pos_backend.controller.Category;

import com.example.pos_backend.dto.Category.CategoryRequestDTO;
import com.example.pos_backend.dto.Category.CategoryResponseDTO;
import com.example.pos_backend.dto.ErrorResponse;
import com.example.pos_backend.modal.User.User;
import com.example.pos_backend.service.Category.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/category")

public class CategoryController {

    private final CategoryService service;

    public CategoryController(CategoryService service) {
        this.service = service;
    }

    // ============================================
    // GET ALL CATEGORIES for logged-in user
    // ============================================
    @GetMapping
    public ResponseEntity<?> getMyCategories(@AuthenticationPrincipal User user) {
        try {
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Not authenticated"));
            }

            return ResponseEntity.ok(service.getMyCategories(user.getEmail()));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to load categories"));
        }
    }

    // ============================================
    // GET CATEGORY BY ID
    // ============================================
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {

        try {
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Not authenticated"));
            }

            return ResponseEntity.ok(service.getCategoryById(id, user.getEmail()));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Something went wrong"));
        }
    }

    // ============================================
    // CREATE CATEGORY (LOGGED-IN USER)
    // ============================================
    @PostMapping
    public ResponseEntity<?> createCategory(
            @RequestBody CategoryRequestDTO dto,
            @AuthenticationPrincipal User user) {

        try {
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Not authenticated"));
            }

            CategoryResponseDTO created =
                    service.createCategory(dto, user.getEmail());

            return ResponseEntity.status(HttpStatus.CREATED).body(created);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Something went wrong"));
        }
    }

    // ==================================================
// UPDATE CATEGORY (LOGGED-IN USER)
// ==================================================
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(
            @PathVariable Long id,
            @RequestBody CategoryRequestDTO dto,
            @AuthenticationPrincipal User user
    ) {

        try {
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Not authenticated"));
            }

            CategoryResponseDTO updated =
                    service.updateCategory(id, dto, user.getEmail());

            return ResponseEntity.ok(updated);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Something went wrong"));
        }
    }


    // ============================================
    // DELETE CATEGORY
    // ============================================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {

        try {
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Not authenticated"));
            }

            String msg = service.deleteCategory(id, user.getEmail());
            return ResponseEntity.ok(msg);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Something went wrong"));
        }
    }
}
