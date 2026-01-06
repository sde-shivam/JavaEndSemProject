package com.example.pos_backend.service.Order;



import com.example.pos_backend.dto.Order.OrderRequestDTO;
import com.example.pos_backend.dto.Order.OrderResponseDTO;

import java.util.List;

public interface OrderService {

    OrderResponseDTO createOrder(OrderRequestDTO dto, String userEmail);

    List<OrderResponseDTO> getMyOrders(String userEmail);

    OrderResponseDTO getOrderById(Long id, String userEmail);
}
