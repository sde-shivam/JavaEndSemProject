//package com.example.pos_backend.service;
//
//import com.example.pos_backend.modal.User.User;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.SignatureAlgorithm;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.stereotype.Service;
//
//import java.security.Key;
//import java.util.Date;
//
//@Service
//public class JwtService {
//
//    // 64+ chars secret key
//    private static final String SECRET_KEY =
//            "A7fH93kLm20PqR91xZ8sK40wB52UaEh37FgT91QwCxZ8mLp6N29vB73K1Jd8S4tQ";
//
//    private static final long EXPIRATION_TIME = 1000L * 60 * 60 * 24; // 24h
//
//    private Key getSigningKey() {
//        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
//    }
//
//    public String generateAccessToken(User user) {
//        return Jwts.builder()
//                .setSubject(user.getEmail())
//                .claim("role", "ROLE_" + user.getRole())
//                .claim("id", user.getId())
//                .setIssuedAt(new Date())
//                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
//                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
//                .compact();
//    }
//
//    public String extractEmail(String token) {
//        return Jwts.parserBuilder()
//                .setSigningKey(getSigningKey())
//                .build()
//                .parseClaimsJws(token)
//                .getBody()
//                .getSubject();
//    }
//
//    public boolean isTokenValid(String token) {
//        try {
//            Date exp = Jwts.parserBuilder()
//                    .setSigningKey(getSigningKey())
//                    .build()
//                    .parseClaimsJws(token)
//                    .getBody()
//                    .getExpiration();
//            return exp.after(new Date());
//        } catch (Exception e) {
//            return false;
//        }
//    }
//}


package com.example.pos_backend.service.User;

import com.example.pos_backend.modal.User.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    // 64+ chars recommended secret for HS256
    @Value("${jwt.secret}")
    private String SECRET_KEY ;

    // Token validity: 24 hours
    private static final long EXPIRATION_TIME = 1000L * 60 * 60 * 24;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    // -------------------------
    // GENERATE TOKEN
    // -------------------------
    public String generateAccessToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())                    // identifies the user
                .claim("role", "ROLE_" + user.getRole())        // Spring Security format
                .claim("id", user.getId())                      // optional, useful for admin actions
                .setIssuedAt(new Date())                        // token creation date
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // -------------------------
    // VALIDATE TOKEN
    // -------------------------
    public boolean isTokenValid(String token) {
        try {
            Date exp = extractAllClaims(token).getExpiration();
            return exp.after(new Date());
        } catch (Exception e) {
            return false; // expired or corrupted token
        }
    }

    // -------------------------
    // EXTRACT EMAIL (subject)
    // -------------------------
    public String extractEmail(String token) {
        try {
            return extractAllClaims(token).getSubject();
        } catch (Exception e) {
            return null;
        }
    }

    // -------------------------
    // INTERNAL CLAIM PARSER
    // -------------------------
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
