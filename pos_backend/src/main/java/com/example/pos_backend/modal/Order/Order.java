package com.example.pos_backend.modal.Order;

import com.example.pos_backend.modal.User.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")   // Important: must NOT be “order” because it's SQL keyword
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // WHO CREATED THE ORDER (SHOP USER)
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // CUSTOMER DETAILS (OPTIONAL)
    private String customerName;
    private String customerPhone;

    // CHILD ITEMS
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    // BILLING FIELDS
    private Double subTotal;
    private Double taxPercent;
    private Double taxAmount;
    private Double discountPercent;
    private Double discountAmount;
    private Double totalAmount;

    // PAYMENT (CASH / UPI / CARD)
    private String paymentMethod;

    // GENERATED BILL NUMBER
    @Column(unique = true)
    private String billNumber;

    // TIMESTAMPS
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (billNumber == null) {
            billNumber = "BILL-" + System.currentTimeMillis();
        }
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // getters & setters
    // ...


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

    public Double getSubTotal() {
        return subTotal;
    }

    public void setSubTotal(Double subTotal) {
        this.subTotal = subTotal;
    }

    public Double getTaxPercent() {
        return taxPercent;
    }

    public void setTaxPercent(Double taxPercent) {
        this.taxPercent = taxPercent;
    }

    public Double getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(Double taxAmount) {
        this.taxAmount = taxAmount;
    }

    public Double getDiscountPercent() {
        return discountPercent;
    }

    public void setDiscountPercent(Double discountPercent) {
        this.discountPercent = discountPercent;
    }

    public Double getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(Double discountAmount) {
        this.discountAmount = discountAmount;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getBillNumber() {
        return billNumber;
    }

    public void setBillNumber(String billNumber) {
        this.billNumber = billNumber;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
