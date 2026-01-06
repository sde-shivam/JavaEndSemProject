package com.example.pos_backend.repository.Order;

import com.example.pos_backend.modal.Order.Order;
import com.example.pos_backend.modal.User.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepo extends JpaRepository<Order, Long> {

    // Get all orders of logged-in user
    List<Order> findByUser(User user);
}
