package com.example.pos_backend.controller.Order;

import com.example.pos_backend.dto.ErrorResponse;

import com.example.pos_backend.dto.Order.OrderRequestDTO;
import com.example.pos_backend.dto.Order.OrderResponseDTO;
import com.example.pos_backend.modal.User.User;


import com.example.pos_backend.service.Order.OrderService;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")

public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // CREATE ORDER
    @PostMapping
    public ResponseEntity<?> createOrder(
            @RequestBody OrderRequestDTO dto,
            @AuthenticationPrincipal User user) {

        try {
            if (user == null)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Not authenticated"));

            OrderResponseDTO response =
                    orderService.createOrder(dto, user.getEmail());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    // GET MY ORDERS
    @GetMapping
    public ResponseEntity<?> getMyOrders(@AuthenticationPrincipal User user) {

        try {
            if (user == null)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Not authenticated"));

            return ResponseEntity.ok(orderService.getMyOrders(user.getEmail()));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    // GET ORDER BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {

        try {
            if (user == null)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Not authenticated"));

            return ResponseEntity.ok(orderService.getOrderById(id, user.getEmail()));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
}
