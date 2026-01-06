package com.example.pos_backend.implement.Product;


import com.example.pos_backend.dto.Product.ProductRequestDTO;
import com.example.pos_backend.dto.Product.ProductResponseDTO;
import com.example.pos_backend.modal.Category.Category;
import com.example.pos_backend.modal.Product.Product;
import com.example.pos_backend.modal.User.User;
import com.example.pos_backend.repository.Category.CategoryRepo;
import com.example.pos_backend.repository.Product.ProductRepo;
import com.example.pos_backend.repository.User.UserRepo;
import com.example.pos_backend.service.Product.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductImplement implements ProductService {

    private final UserRepo userRepo;
    private final CategoryRepo categoryRepo;
    private final ProductRepo productRepo;

    public ProductImplement(UserRepo userRepo,
                            CategoryRepo categoryRepo,
                            ProductRepo productRepo) {
        this.userRepo = userRepo;
        this.categoryRepo = categoryRepo;
        this.productRepo = productRepo;
    }

    // ---------------------- CREATE ----------------------
    @Override
    public ProductResponseDTO create(ProductRequestDTO dto, String userEmail) {

        User user = userRepo.findByemail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category = categoryRepo.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (productRepo.existsByNameAndUser(dto.getName(), user)) {
            throw new RuntimeException("Product already exists");
        }

        Product p = new Product();
        p.setUser(user);
        p.setCategory(category);
        p.setName(dto.getName());
        p.setBarcode(dto.getBarcode());
        p.setDescription(dto.getDescription());
        p.setCostPrice(dto.getCostPrice());
        p.setSellingPrice(dto.getSellingPrice());
        p.setStock(dto.getStock());
        p.setLowStockAlert(dto.getLowStockAlert() != null ? dto.getLowStockAlert() : 0);

        Product saved = productRepo.save(p);

        return toDto(saved);
    }

    // ---------------------- UPDATE ----------------------
    @Override

    public ProductResponseDTO update(Long id, ProductRequestDTO dto, String userEmail) {

        User user = userRepo.findByemail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not allowed to edit this product");
        }

        // IMPORTANT FIX
        if (product.getSku() == null || product.getSku().trim().isEmpty()) {
            product.setSku("PRD-" + System.currentTimeMillis());
        }

        if (dto.getName() != null) product.setName(dto.getName());
        // BARCODE
        // BARCODE: allow clearing → auto-generate new one
        if (dto.getBarcode() != null) {
            if (dto.getBarcode().trim().isEmpty()) {
                // user cleared the barcode → generate new one
                product.setBarcode(String.valueOf((long)(Math.random() * 10000000000L)));
            } else {
                // user entered a barcode manually
                product.setBarcode(dto.getBarcode().trim());
            }
        }


// DESCRIPTION
        if (dto.getDescription() != null) {
            if (dto.getDescription().trim().isEmpty()) {
                product.setDescription(null); // clear
            } else {
                product.setDescription(dto.getDescription().trim());
            }
        }

        if (dto.getCostPrice() != null) product.setCostPrice(dto.getCostPrice());
        if (dto.getSellingPrice() != null) product.setSellingPrice(dto.getSellingPrice());
        if (dto.getStock() != null) product.setStock(dto.getStock());
        if (dto.getLowStockAlert() != null) product.setLowStockAlert(dto.getLowStockAlert());

        if (dto.getCategoryId() != null) {
            Category category = categoryRepo.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }

        Product saved = productRepo.save(product);

        return toDto(saved);
    }


    // ---------------------- DELETE ----------------------
    @Override
    public String delete(Long id, String userEmail) {

        User user = userRepo.findByemail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not allowed to delete this product");
        }

        productRepo.delete(product);
        return "Product deleted successfully";
    }

    // ---------------------- MY PRODUCTS ----------------------
    @Override
    public List<ProductResponseDTO> getMyProducts(String userEmail) {

        User user = userRepo.findByemail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Product> list = productRepo.findByUser(user);

        return list.stream().map(this::toDto).toList();
    }

    // ---------------------- BY CATEGORY ----------------------
    @Override
    public List<ProductResponseDTO> getMyProductsByCategory(String userEmail, Long categoryId) {

        User user = userRepo.findByemail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        List<Product> list = productRepo.findByUserAndCategory(user, category);
        list.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
        return list.stream().map(this::toDto).toList();
    }

    // ---------------------- MAPPER ----------------------
    private ProductResponseDTO toDto(Product p) {
        double profitPerUnit = 0.0;
        if (p.getCostPrice() != null && p.getSellingPrice() != null) {
            profitPerUnit = p.getSellingPrice() - p.getCostPrice();
        }

        return new ProductResponseDTO(
                p.getId(),
                p.getName(),
                p.getSku(),
                p.getBarcode(),
                p.getDescription(),
                p.getCostPrice(),
                p.getSellingPrice(),
                profitPerUnit,
                p.getStock(),
                p.getLowStockAlert(),
                p.getCategory().getId(),
                p.getCategory().getName(),
                p.getCreatedAt() != null ? p.getCreatedAt().toString() : null,
                p.getUpdatedAt() != null ? p.getUpdatedAt().toString() : null
        );
    }
}
