package com.ecom.service;

import com.ecom.model.Order;
import com.ecom.model.User;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private boolean mailEnabled;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
        this.mailEnabled = true;
    }

    public void sendOrderConfirmationEmail(User user, Order order) {
        if (!mailEnabled) return;
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Order Confirmation - Order #" + order.getId());
            message.setText(buildOrderConfirmationBody(order));
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send order confirmation email: " + e.getMessage());
        }
    }

    public void sendWelcomeEmail(User user) {
        if (!mailEnabled) return;
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Welcome to Our E-Commerce Store!");
            message.setText("Welcome " + user.getEmail() + "!\n\nThank you for registering. Start shopping now!");
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }
    }

    private String buildOrderConfirmationBody(Order order) {
        StringBuilder body = new StringBuilder();
        body.append("Thank you for your order!\n\n");
        body.append("Order ID: ").append(order.getId()).append("\n");
        body.append("Status: ").append(order.getStatus()).append("\n");
        body.append("Total: $").append(String.format("%.2f", order.getTotal())).append("\n");
        body.append("Order Date: ").append(order.getCreatedAt()).append("\n\n");
        body.append("Items:\n");

        order.getItems().forEach(item ->
                body.append("- ").append(item.getProductName())
                        .append(" x").append(item.getQuantity())
                        .append(" @ $").append(String.format("%.2f", item.getPriceAtPurchase()))
                        .append("\n")
        );

        body.append("\nWe'll notify you when your order ships!");
        return body.toString();
    }
}
