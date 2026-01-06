package com.example.pos_backend.controller.User;

import com.example.pos_backend.dto.ErrorResponse;
import com.example.pos_backend.dto.User.UserLoginDTO;
import com.example.pos_backend.dto.User.UserRequestDTO;
import com.example.pos_backend.dto.User.UserResponseDTO;
import com.example.pos_backend.modal.User.User;
import com.example.pos_backend.service.User.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")

public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // =====================================================================
    // SIGNUP (PUBLIC)
    // =====================================================================
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserRequestDTO dto) {
        try {
            UserResponseDTO created = userService.signup(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Something went wrong"));
        }
    }

    // =====================================================================
    // LOGIN (PUBLIC)
    // -> Return JSON
    // -> Set HttpOnly Cookie (JWT)
    // =====================================================================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginDTO dto,
                                   HttpServletResponse response) {
        try {
            UserResponseDTO userRes = userService.login(dto);

            String token = userRes.getToken();

            // Normal cookie
            Cookie cookie = new Cookie("accessToken", token);
            cookie.setHttpOnly(true);
            cookie.setSecure(false);       // must be FALSE on localhost
            cookie.setPath("/");
            cookie.setMaxAge(24 * 60 * 60); // 1 day
            response.addCookie(cookie);

            // SameSite=None fix (Spring cannot set this correctly)
            response.addHeader(
                    "Set-Cookie",
                    "accessToken=" + token
                            + "; HttpOnly; Secure=false; Path=/; SameSite=None"
            );

            return ResponseEntity.ok(userRes);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Something went wrong"));
        }
    }

    // =====================================================================
    // LOGOUT (AUTHENTICATED)
    // =====================================================================
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        try {
            Cookie cookie = new Cookie("accessToken", "");
            cookie.setHttpOnly(true);
            cookie.setSecure(false);
            cookie.setPath("/");
            cookie.setMaxAge(0); // delete immediately
            response.addCookie(cookie);

            // SameSite delete fix
            response.addHeader(
                    "Set-Cookie",
                    "accessToken=; HttpOnly; Secure=false; Path=/; Max-Age=0; SameSite=None"
            );

            return ResponseEntity.ok("Logged out successfully");

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Something went wrong"));
        }
    }

    // =====================================================================
    // GET MY PROFILE (AUTHENTICATED)
    // =====================================================================
    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(@AuthenticationPrincipal User user) {
        try {
            if (user == null) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Not authenticated"));
            }

            UserResponseDTO dto = userService.getMyProfile(user.getEmail());
            return ResponseEntity.ok(dto);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Something went wrong"));
        }
    }

    // =====================================================================
    // UPDATE SHOP NAME (AUTHENTICATED)
    // =====================================================================
    @PutMapping("/shopname")
    public ResponseEntity<?> updateMyShopname(@AuthenticationPrincipal User user,
                                              @RequestBody String shopname) {
        try {
            if (user == null) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Not authenticated"));
            }

            UserResponseDTO dto =
                    userService.updateMyShopname(user.getEmail(), shopname);

            return ResponseEntity.ok(dto);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Something went wrong"));
        }
    }
}
