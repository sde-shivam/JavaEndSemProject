package com.example.pos_backend.dto.Product;

public class ProductResponseDTO {

    private Long id;
    private String name;
    private String sku;
    private String barcode;
    private String description;

    private Double costPrice;
    private Double sellingPrice;
    private Double profitPerUnit;

    private Integer stock;
    private Integer lowStockAlert;

    private Long categoryId;
    private String categoryName;

    private String createdAt;
    private String updatedAt;

    public ProductResponseDTO() {}

    public ProductResponseDTO(Long id,
                              String name,
                              String sku,
                              String barcode,
                              String description,
                              Double costPrice,
                              Double sellingPrice,
                              Double profitPerUnit,
                              Integer stock,
                              Integer lowStockAlert,
                              Long categoryId,
                              String categoryName,
                              String createdAt,
                              String updatedAt) {

        this.id = id;
        this.name = name;
        this.sku = sku;
        this.barcode = barcode;
        this.description = description;

        this.costPrice = costPrice;
        this.sellingPrice = sellingPrice;
        this.profitPerUnit = profitPerUnit != null
                ? profitPerUnit
                : (sellingPrice != null && costPrice != null
                ? (sellingPrice - costPrice)
                : null);

        this.stock = stock;
        this.lowStockAlert = lowStockAlert;

        this.categoryId = categoryId;
        this.categoryName = categoryName;

        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // getters & setters ...

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSku() {
        return sku;
    }

    public String getBarcode() {
        return barcode;
    }

    public String getDescription() {
        return description;
    }

    public Double getCostPrice() {
        return costPrice;
    }

    public Double getSellingPrice() {
        return sellingPrice;
    }

    public Double getProfitPerUnit() {
        return profitPerUnit;
    }

    public Integer getStock() {
        return stock;
    }

    public Integer getLowStockAlert() {
        return lowStockAlert;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCostPrice(Double costPrice) {
        this.costPrice = costPrice;
    }

    public void setSellingPrice(Double sellingPrice) {
        this.sellingPrice = sellingPrice;
    }

    public void setProfitPerUnit(Double profitPerUnit) {
        this.profitPerUnit = profitPerUnit;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public void setLowStockAlert(Integer lowStockAlert) {
        this.lowStockAlert = lowStockAlert;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }
}
