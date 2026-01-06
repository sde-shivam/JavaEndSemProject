package com.example.pos_backend.controller.Product;

import com.example.pos_backend.dto.ErrorResponse;

import com.example.pos_backend.dto.Product.ProductRequestDTO;
import com.example.pos_backend.dto.Product.ProductResponseDTO;
import com.example.pos_backend.modal.User.User;
import com.example.pos_backend.service.Product.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/products")

public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    // GET /products  -> my products
    @GetMapping
    public ResponseEntity<?> getMyProducts(@AuthenticationPrincipal User user) {
        try {
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Not authenticated"));
            }
            return ResponseEntity.ok(service.getMyProducts(user.getEmail()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to load products"));
        }
    }

    // GET /products/category/{categoryId}
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<?> getMyProductsByCategory(
            @PathVariable Long categoryId,
            @AuthenticationPrincipal User user) {
        try {
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Not authenticated"));
            }
            return ResponseEntity.ok(
                    service.getMyProductsByCategory(user.getEmail(), categoryId)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to load products"));
        }
    }

    // POST /products
    @PostMapping
    public ResponseEntity<?> createProduct(
            @RequestBody ProductRequestDTO dto,
            @AuthenticationPrincipal User user) {

        try {
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Not authenticated"));
            }

            ProductResponseDTO created = service.create(dto, user.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(created);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Something went wrong"));
        }
    }

    // PUT /products/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequestDTO dto,
            @AuthenticationPrincipal User user) {

        try {
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Not authenticated"));
            }

            ProductResponseDTO updated = service.update(id, dto, user.getEmail());
            return ResponseEntity.ok(updated);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Something went wrong"));
        }
    }

    // DELETE /products/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {

        try {
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Not authenticated"));
            }

            String msg = service.delete(id, user.getEmail());
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
