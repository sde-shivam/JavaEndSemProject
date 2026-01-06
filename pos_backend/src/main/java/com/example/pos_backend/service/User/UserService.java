package com.example.pos_backend.service.User;

import com.example.pos_backend.dto.User.UserLoginDTO;
import com.example.pos_backend.dto.User.UserRequestDTO;
import com.example.pos_backend.dto.User.UserResponseDTO;

import java.util.List;

public interface UserService {
    // USER AUTH
    UserResponseDTO signup (UserRequestDTO dto);
    UserResponseDTO login(UserLoginDTO dto);

    // USER SELF DASHBOARD
    UserResponseDTO getMyProfile(String email);
    UserResponseDTO updateMyShopname(String email, String shopname);

    // ADMIN FEATURES
    List<UserResponseDTO> getAllUsers();
    UserResponseDTO getUserById(Long id);
    UserResponseDTO updateActiveStatus(Long id, boolean active);

    // DELETE USER (ADMIN)
    String deleteUser(Long id);
}
