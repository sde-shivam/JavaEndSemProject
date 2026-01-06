package com.example.pos_backend.implement.Order;


import com.example.pos_backend.dto.Order.OrderItemRequestDTO;
import com.example.pos_backend.dto.Order.OrderItemResponseDTO;
import com.example.pos_backend.dto.Order.OrderRequestDTO;
import com.example.pos_backend.dto.Order.OrderResponseDTO;
import com.example.pos_backend.modal.Order.Order;
import com.example.pos_backend.modal.Order.OrderItem;
import com.example.pos_backend.modal.Product.Product;
import com.example.pos_backend.modal.User.User;

import com.example.pos_backend.repository.Order.OrderRepo;
import com.example.pos_backend.repository.Product.ProductRepo;
import com.example.pos_backend.repository.User.UserRepo;


import com.example.pos_backend.service.Order.OrderService;
import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderImpliment implements OrderService {

    private final UserRepo userRepo;
    private final ProductRepo productRepo;
    private final OrderRepo orderRepo;

    public OrderImpliment(UserRepo userRepo, ProductRepo productRepo, OrderRepo orderRepo) {
        this.userRepo = userRepo;
        this.productRepo = productRepo;
        this.orderRepo = orderRepo;
    }

    // ---------------------------------------------------------
    // CREATE ORDER
    // ---------------------------------------------------------
    @Override
    @Transactional
    public OrderResponseDTO createOrder(OrderRequestDTO dto, String userEmail) {

        User user = userRepo.findByemail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        double taxPercent = dto.getTaxPercent() == null ? 0 : dto.getTaxPercent();
        double discountPercent = dto.getDiscountPercent() == null ? 0 : dto.getDiscountPercent();

        Order order = new Order();
        order.setUser(user);
        order.setCustomerName(dto.getCustomerName());
        order.setCustomerPhone(dto.getCustomerPhone());
        order.setPaymentMethod(dto.getPaymentMethod());

        double subTotal = 0.0;

        if (dto.getItems() == null || dto.getItems().isEmpty()) {
            throw new RuntimeException("Order must contain at least one item");
        }

        for (OrderItemRequestDTO itemDTO : dto.getItems()) {

            Product product = productRepo.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemDTO.getProductId()));

            // Stock validation
            if (product.getStock() != null && product.getStock() < itemDTO.getQuantity()) {
                throw new RuntimeException("Insufficient stock: " + product.getName());
            }

            // Build order item
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemDTO.getQuantity());

            double sellingPrice = product.getSellingPrice() == null ? 0 : product.getSellingPrice();
            double costPrice = product.getCostPrice() == null ? 0 : product.getCostPrice();

            double itemTotal = sellingPrice * itemDTO.getQuantity();
            double profitPU = sellingPrice - costPrice;
            double totalProfit = profitPU * itemDTO.getQuantity();

            item.setSellingPrice(sellingPrice);
            item.setTotalPrice(itemTotal);
            item.setProfitPerUnit(profitPU);
            item.setTotalProfit(totalProfit);

            order.getItems().add(item);
            subTotal += itemTotal;

            // Deduct stock
            if (product.getStock() != null) {
                product.setStock(product.getStock() - itemDTO.getQuantity());
            }
            productRepo.save(product);
        }

        double taxAmount = (subTotal * taxPercent) / 100;
        double discountAmount = (subTotal * discountPercent) / 100;
        double finalTotal = subTotal + taxAmount - discountAmount;

        order.setSubTotal(subTotal);
        order.setTaxPercent(taxPercent);
        order.setTaxAmount(taxAmount);
        order.setDiscountPercent(discountPercent);
        order.setDiscountAmount(discountAmount);
        order.setTotalAmount(finalTotal);

        Order saved = orderRepo.save(order);

        return convertToDTO(saved);
    }


    // ---------------------------------------------------------
    // GET MY ORDERS
    // ---------------------------------------------------------
    @Override
    public List<OrderResponseDTO> getMyOrders(String userEmail) {

        User user = userRepo.findByemail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return orderRepo.findByUser(user)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // ---------------------------------------------------------
    // GET ORDER BY ID
    // ---------------------------------------------------------
    @Override
    public OrderResponseDTO getOrderById(Long id, String userEmail) {

        Order order = orderRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized");
        }

        return convertToDTO(order);
    }


    // ---------------------------------------------------------
    // CONVERT ORDER → DTO
    // ---------------------------------------------------------
    private OrderResponseDTO convertToDTO(Order o) {
        return new OrderResponseDTO(
                o.getId(),
                o.getCustomerName(),
                o.getCustomerPhone(),
                o.getSubTotal(),
                o.getTaxPercent(),
                o.getTaxAmount(),
                o.getDiscountPercent(),
                o.getDiscountAmount(),
                o.getTotalAmount(),
                o.getPaymentMethod(),
                o.getBillNumber(),
                o.getCreatedAt().toString(),
                o.getUpdatedAt().toString(),

                o.getItems().stream()
                        .map(item -> new OrderItemResponseDTO(
                                item.getId(),
                                item.getProduct().getId(),
                                item.getProduct().getName(),
                                item.getQuantity(),
                                item.getSellingPrice(),
                                item.getTotalPrice(),
                                item.getProfitPerUnit(),
                                item.getTotalProfit()
                        ))
                        .collect(Collectors.toList())
        );
    }
}
