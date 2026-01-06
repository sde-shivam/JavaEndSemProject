package com.example.pos_backend.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Value("${FRONTEND_URL}")
    private String frontendUrl;

    // ----------------------------------
    // PASSWORD ENCODER
    // ----------------------------------
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ----------------------------------
    // SECURITY FILTER CHAIN
    // ----------------------------------
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth

                        // PUBLIC
                        .requestMatchers(
                                "/user/signup",
                                "/user/login"
                        ).permitAll()

                        // ADMIN ONLY
                        .requestMatchers("/admin/**").hasRole("ADMIN")

                        // USER + ADMIN
                        .requestMatchers(
                                "/user/**",
                                "/category/**",
                                "/products/**",
                                "/orders/**"
                        ).hasAnyRole("USER", "ADMIN")

                        // EVERYTHING ELSE
                        .anyRequest().authenticated()
                )

                // JWT FILTER
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // ----------------------------------
    // AUTHENTICATION MANAGER
    // ----------------------------------
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {
        return config.getAuthenticationManager();
    }

    // ----------------------------------
    // CORS CONFIG
    // ----------------------------------
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOriginPatterns(List.of(frontendUrl));

        config.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));

        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        // Needed for cookies + Authorization header
        config.setExposedHeaders(List.of(
                "Authorization",
                "Set-Cookie"
        ));

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
