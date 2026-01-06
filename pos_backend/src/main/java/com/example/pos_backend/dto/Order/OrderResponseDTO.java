package com.example.pos_backend.dto.Order;

import com.example.pos_backend.dto.Order.OrderItemResponseDTO;

import java.util.List;

public class OrderResponseDTO {

    private Long id;

    private String customerName;
    private String customerPhone;

    private Double subTotal;
    private Double taxPercent;
    private Double taxAmount;

    private Double discountPercent;
    private Double discountAmount;

    private Double totalAmount;

    private String paymentMethod;
    private String billNumber;

    private String createdAt;
    private String updatedAt;

    private List<OrderItemResponseDTO> items;

    public OrderResponseDTO(Long id,
                            String customerName,
                            String customerPhone,
                            Double subTotal,
                            Double taxPercent,
                            Double taxAmount,
                            Double discountPercent,
                            Double discountAmount,
                            Double totalAmount,
                            String paymentMethod,
                            String billNumber,
                            String createdAt,
                            String updatedAt,
                            List<OrderItemResponseDTO> items) {

        this.id = id;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.subTotal = subTotal;
        this.taxPercent = taxPercent;
        this.taxAmount = taxAmount;
        this.discountPercent = discountPercent;
        this.discountAmount = discountAmount;
        this.totalAmount = totalAmount;
        this.paymentMethod = paymentMethod;
        this.billNumber = billNumber;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.items = items;
    }

    // getters only (response)

    public Long getId() {
        return id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public Double getSubTotal() {
        return subTotal;
    }

    public Double getTaxPercent() {
        return taxPercent;
    }

    public Double getTaxAmount() {
        return taxAmount;
    }

    public Double getDiscountPercent() {
        return discountPercent;
    }

    public Double getDiscountAmount() {
        return discountAmount;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public String getBillNumber() {
        return billNumber;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public List<OrderItemResponseDTO> getItems() {
        return items;
    }
}
