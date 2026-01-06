package com.example.pos_backend.dto.User;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
public class UserRequestDTO {

    private String shopname;
    private String email;
    private String password;
    private String role; // optional, default USER if null

    public String getShopname() { return shopname; }
    public void setShopname(String shopname) { this.shopname = shopname; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
