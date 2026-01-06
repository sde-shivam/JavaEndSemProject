package com.example.pos_backend.dto.User;

public class UserResponseDTO {

    private Long id;
    private String shopname;
    private String email;
    private String role;
    private boolean active;
    private String createdAt;
    private String updatedAt;
    private String token; // JWT token (for JSON response)

    public UserResponseDTO() {}

    public UserResponseDTO(Long id, String shopname, String email, String role,
                           boolean active, String createdAt, String updatedAt, String token) {
        this.id = id;
        this.shopname = shopname;
        this.email = email;
        this.role = role;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.token = token;
    }

    // Getters & setters …

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getShopname() { return shopname; }
    public void setShopname(String shopname) { this.shopname = shopname; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}
