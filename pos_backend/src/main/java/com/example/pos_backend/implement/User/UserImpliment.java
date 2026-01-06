package com.example.pos_backend.implement.User;

import com.example.pos_backend.modal.User.User;
import com.example.pos_backend.dto.User.UserLoginDTO;
import com.example.pos_backend.dto.User.UserRequestDTO;
import com.example.pos_backend.dto.User.UserResponseDTO;
import com.example.pos_backend.repository.User.UserRepo;
import com.example.pos_backend.service.User.JwtService;
import com.example.pos_backend.service.User.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserImpliment implements UserService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserImpliment(UserRepo userRepo,
                         PasswordEncoder passwordEncoder,
                         JwtService jwtService) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // ===========================
    // SIGNUP
    // ===========================
    @Override
    public UserResponseDTO signup(UserRequestDTO dto) {

        if (userRepo.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setShopname(dto.getShopname());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(dto.getRole()); // null → entity default "USER"

        User saved = userRepo.save(user);

        return new UserResponseDTO(
                saved.getId(),
                saved.getShopname(),
                saved.getEmail(),
                saved.getRole(),
                saved.isActive(),
                saved.getCreatedAt().toString(),
                saved.getUpdatedAt().toString(),
                null // signup does NOT return token
        );
    }

    // ===========================
    // LOGIN
    // ===========================
    @Override
    public UserResponseDTO login(UserLoginDTO dto) {

        User user = userRepo.findByemail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        if (!user.isActive()) {
            throw new RuntimeException("User account is inactive");
        }

        // generate JWT token
        String token = jwtService.generateAccessToken(user);

        return new UserResponseDTO(
                user.getId(),
                user.getShopname(),
                user.getEmail(),
                user.getRole(),
                user.isActive(),
                user.getCreatedAt().toString(),
                user.getUpdatedAt().toString(),
                token
        );
    }

    // ===========================
    // GET OWN PROFILE
    // ===========================
    @Override
    public UserResponseDTO getMyProfile(String email) {

        User user = userRepo.findByemail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserResponseDTO(
                user.getId(),
                user.getShopname(),
                user.getEmail(),
                user.getRole(),
                user.isActive(),
                user.getCreatedAt().toString(),
                user.getUpdatedAt().toString(),
                null
        );
    }

    // ===========================
    // UPDATE OWN SHOPNAME
    // ===========================
    @Override
    public UserResponseDTO updateMyShopname(String email, String shopname) {

        User user = userRepo.findByemail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setShopname(shopname);
        User updated = userRepo.save(user);

        return new UserResponseDTO(
                updated.getId(),
                updated.getShopname(),
                updated.getEmail(),
                updated.getRole(),
                updated.isActive(),
                updated.getCreatedAt().toString(),
                updated.getUpdatedAt().toString(),
                null
        );
    }

    // ===========================
    // GET ALL USERS (Admin only)
    // ===========================
    @Override
    public List<UserResponseDTO> getAllUsers() {

        return userRepo.findAll()
                .stream()
                .map(user -> new UserResponseDTO(
                        user.getId(),
                        user.getShopname(),
                        user.getEmail(),
                        user.getRole(),
                        user.isActive(),
                        user.getCreatedAt().toString(),
                        user.getUpdatedAt().toString(),
                        null
                )).collect(Collectors.toList());
    }

    // ===========================
    // GET USER BY ID
    // ===========================
    @Override
    public UserResponseDTO getUserById(Long id) {

        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserResponseDTO(
                user.getId(),
                user.getShopname(),
                user.getEmail(),
                user.getRole(),
                user.isActive(),
                user.getCreatedAt().toString(),
                user.getUpdatedAt().toString(),
                null
        );
    }

    // ===========================
    // ACTIVATE / DEACTIVATE USER
    // ===========================
    @Override
    public UserResponseDTO updateActiveStatus(Long id, boolean active) {

        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setActive(active);
        User updated = userRepo.save(user);

        return new UserResponseDTO(
                updated.getId(),
                updated.getShopname(),
                updated.getEmail(),
                updated.getRole(),
                updated.isActive(),
                updated.getCreatedAt().toString(),
                updated.getUpdatedAt().toString(),
                null
        );
    }

    // ===========================
    // DELETE USER
    // ===========================
    @Override
    public String deleteUser(Long id) {

        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userRepo.delete(user);

        return "User deleted successfully";
    }
}
