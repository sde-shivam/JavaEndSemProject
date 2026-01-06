package com.example.pos_backend.repository.Order;

import com.example.pos_backend.modal.Order.OrderItem;
import com.example.pos_backend.modal.Order.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderItemRepo extends JpaRepository<OrderItem, Long> {

    // Fetch all items inside a specific order
    List<OrderItem> findByOrder(Order order);
}
