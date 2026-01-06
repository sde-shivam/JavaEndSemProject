package com.example.pos_backend.config;

import com.example.pos_backend.modal.User.User;
import com.example.pos_backend.repository.User.UserRepo;
import com.example.pos_backend.service.User.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepo userRepo;

    public JwtAuthenticationFilter(JwtService jwtService, UserRepo userRepo) {
        this.jwtService = jwtService;
        this.userRepo = userRepo;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String token = extractToken(request);

        try {
            if (token != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                String email = jwtService.extractEmail(token);

                if (email != null && jwtService.isTokenValid(token)) {

                    User user = userRepo.findByemail(email).orElse(null);

                    if (user != null && user.isActive()) {

                        SimpleGrantedAuthority authority =
                                new SimpleGrantedAuthority("ROLE_" + user.getRole());

                        UsernamePasswordAuthenticationToken auth =
                                new UsernamePasswordAuthenticationToken(
                                        user,
                                        null,
                                        List.of(authority)
                                );

                        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                }
            }
        } catch (Exception ignored) {
            // Token invalid/expired → ignore authentication silently
        }

        filterChain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {

        // 1) Header token
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer "))
            return authHeader.substring(7);

        // 2) Cookie token
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie c : cookies)
                if ("accessToken".equals(c.getName()))
                    return c.getValue();
        }

        return null;
    }
}
