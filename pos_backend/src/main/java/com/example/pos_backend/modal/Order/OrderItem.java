package com.example.pos_backend.modal.Order;


import com.example.pos_backend.modal.Product.Product;
import jakarta.persistence.*;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // PARENT ORDER
    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    // PRODUCT
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private Integer quantity;
    private Double sellingPrice;   // price at sale time
    private Double totalPrice;     // sellingPrice * quantity

    private Double profitPerUnit;
    private Double totalProfit;

    // getters & setters
    // ...


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getSellingPrice() {
        return sellingPrice;
    }

    public void setSellingPrice(Double sellingPrice) {
        this.sellingPrice = sellingPrice;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Double getProfitPerUnit() {
        return profitPerUnit;
    }

    public void setProfitPerUnit(Double profitPerUnit) {
        this.profitPerUnit = profitPerUnit;
    }

    public Double getTotalProfit() {
        return totalProfit;
    }

    public void setTotalProfit(Double totalProfit) {
        this.totalProfit = totalProfit;
    }
}
