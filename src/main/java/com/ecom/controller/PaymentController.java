package com.ecom.controller;

import com.ecom.dto.CreatePaymentIntentDTO;
import com.ecom.dto.PaymentIntentResponseDTO;
import com.ecom.model.Order;
import com.ecom.model.Payment;
import com.ecom.service.OrderService;
import com.ecom.service.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final OrderService orderService;

    public PaymentController(PaymentService paymentService, OrderService orderService) {
        this.paymentService = paymentService;
        this.orderService = orderService;
    }

    @PostMapping("/create-intent")
    public ResponseEntity<PaymentIntentResponseDTO> createPaymentIntent(@RequestBody CreatePaymentIntentDTO request) {
        Order order = orderService.getOrderById(request.getOrderId());

        Payment payment = paymentService.createPayment(
                request.getOrderId(),
                order.getTotal(),
                Payment.PaymentProvider.STRIPE
        );

        String clientSecret = generateClientSecret();

        PaymentIntentResponseDTO response = new PaymentIntentResponseDTO();
        response.setPaymentId(payment.getId());
        response.setOrderId(order.getId());
        response.setClientSecret(clientSecret);
        response.setAmount(order.getTotal());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/webhook")
    public ResponseEntity<Void> handleStripeWebhook(@RequestBody Map<String, Object> payload) {
        try {
            String type = (String) payload.get("type");

            if ("payment_intent.succeeded".equals(type)) {
                Map<String, Object> data = (Map<String, Object>) payload.get("data");
                Map<String, Object> paymentIntent = (Map<String, Object>) data.get("object");
                String transactionId = (String) paymentIntent.get("id");
                String metadata = (String) paymentIntent.get("metadata");

                Payment payment = paymentService.getPaymentByTransactionId(transactionId);
                paymentService.updatePaymentStatus(payment.getId(), Payment.PaymentStatus.COMPLETED);

                Order order = orderService.getOrderById(payment.getOrderId());
                orderService.updateOrderStatus(order.getId(), Order.OrderStatus.PAID);
            } else if ("payment_intent.payment_failed".equals(type)) {
                Map<String, Object> data = (Map<String, Object>) payload.get("data");
                Map<String, Object> paymentIntent = (Map<String, Object>) data.get("object");
                String transactionId = (String) paymentIntent.get("id");

                Payment payment = paymentService.getPaymentByTransactionId(transactionId);
                paymentService.updatePaymentStatus(payment.getId(), Payment.PaymentStatus.FAILED);

                Order order = orderService.getOrderById(payment.getOrderId());
                orderService.updateOrderStatus(order.getId(), Order.OrderStatus.PENDING);
            }

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{paymentId}/confirm")
    public ResponseEntity<PaymentIntentResponseDTO> confirmPayment(
            @PathVariable Long paymentId,
            @RequestBody Map<String, String> request) {
        String transactionId = request.get("transactionId");

        Payment payment = paymentService.updatePaymentWithTransaction(
                paymentId,
                transactionId,
                Payment.PaymentStatus.COMPLETED
        );

        Order order = orderService.getOrderById(payment.getOrderId());
        orderService.updateOrderStatus(order.getId(), Order.OrderStatus.PAID);

        PaymentIntentResponseDTO response = new PaymentIntentResponseDTO();
        response.setPaymentId(payment.getId());
        response.setOrderId(order.getId());
        response.setAmount(order.getTotal());

        return ResponseEntity.ok(response);
    }

    private String generateClientSecret() {
        return UUID.randomUUID().toString().replace("-", "") + "_secret_" + UUID.randomUUID().toString().replace("-", "");
    }
}
