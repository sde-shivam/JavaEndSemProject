package com.example.pos_backend.service.Product;


import com.example.pos_backend.dto.Product.ProductRequestDTO;
import com.example.pos_backend.dto.Product.ProductResponseDTO;

import java.util.List;

public interface ProductService {

    ProductResponseDTO create(ProductRequestDTO dto, String userEmail);

    ProductResponseDTO update(Long id, ProductRequestDTO dto, String userEmail);

    String delete(Long id, String userEmail);

    List<ProductResponseDTO> getMyProducts(String userEmail);

    List<ProductResponseDTO> getMyProductsByCategory(String userEmail, Long categoryId);
}
