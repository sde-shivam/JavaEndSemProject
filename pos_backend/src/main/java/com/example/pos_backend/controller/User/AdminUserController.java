package com.example.pos_backend.controller.User;

import com.example.pos_backend.dto.ErrorResponse;
import com.example.pos_backend.dto.User.UserResponseDTO;
import com.example.pos_backend.service.User.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/users")


@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    // ==========================
    // GET ALL USERS
    // ==========================
    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        try {
            return ResponseEntity.ok(userService.getAllUsers());
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to load users"));
        }
    }

    // ==========================
    // GET USER BY ID
    // ==========================
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            UserResponseDTO dto = userService.getUserById(id);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to load user"));
        }
    }

    // ==========================
    // ACTIVATE USER
    // ==========================
    @PutMapping("/{id}/activate")
    public ResponseEntity<?> activateUser(@PathVariable Long id) {
        try {
            UserResponseDTO dto = userService.updateActiveStatus(id, true);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to activate user"));
        }
    }

    // ==========================
    // DEACTIVATE USER
    // ==========================
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateUser(@PathVariable Long id) {
        try {
            UserResponseDTO dto = userService.updateActiveStatus(id, false);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to deactivate user"));
        }
    }

    // ==========================
    // DELETE USER
    // ==========================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            String msg = userService.deleteUser(id);
            return ResponseEntity.ok(msg);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to delete user"));
        }
    }
}
