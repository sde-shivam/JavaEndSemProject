package com.example.pos_backend.repository.User;

import com.example.pos_backend.modal.User.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {

    Optional<User> findByemail(String email);
    boolean existsByEmail(String email);
}
