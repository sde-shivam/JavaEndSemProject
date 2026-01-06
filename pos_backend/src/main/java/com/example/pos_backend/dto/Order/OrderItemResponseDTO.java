package com.example.pos_backend.dto.Order;

public class OrderItemResponseDTO {

    private Long id;

    private Long productId;
    private String productName;

    private Integer quantity;
    private Double sellingPrice;
    private Double totalPrice;

    private Double profitPerUnit;
    private Double totalProfit;

    public OrderItemResponseDTO(Long id,
                                Long productId,
                                String productName,
                                Integer quantity,
                                Double sellingPrice,
                                Double totalPrice,
                                Double profitPerUnit,
                                Double totalProfit) {

        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.sellingPrice = sellingPrice;
        this.totalPrice = totalPrice;
        this.profitPerUnit = profitPerUnit;
        this.totalProfit = totalProfit;
    }

    // getters
    public Long getId() { return id; }
    public Long getProductId() { return productId; }
    public String getProductName() { return productName; }
    public Integer getQuantity() { return quantity; }
    public Double getSellingPrice() { return sellingPrice; }
    public Double getTotalPrice() { return totalPrice; }
    public Double getProfitPerUnit() { return profitPerUnit; }
    public Double getTotalProfit() { return totalProfit; }
}
