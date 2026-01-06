package com.example.pos_backend.dto.Category;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



public class CategoryResponseDTO {

    private Long id;
    private String name;
    private String description;
    private String bgColor;
    private int itemCount;   // Number of products inside this category
    private String createdAt;
    private String updatedAt;


    public CategoryResponseDTO(Long id, String name, String description, String bgColor, int itemCount, String createdAt, String updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.bgColor = bgColor;
        this.itemCount = itemCount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getBgColor() {
        return bgColor;
    }

    public void setBgColor(String bgColor) {
        this.bgColor = bgColor;
    }

    public int getItemCount() {
        return itemCount;
    }

    public void setItemCount(int itemCount) {
        this.itemCount = itemCount;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }
}
