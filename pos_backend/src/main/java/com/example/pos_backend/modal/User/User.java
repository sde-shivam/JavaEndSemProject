package com.example.pos_backend.modal.User;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String shopname;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    // "ADMIN" or "USER"
    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private boolean active;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public User() {}

    @PrePersist
    protected void onCreate() {
        if (this.role == null || this.role.isBlank()) {
            this.role = "USER";
        }
        this.active = true;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters & setters …

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getShopname() { return shopname; }
    public void setShopname(String shopname) { this.shopname = shopname; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
