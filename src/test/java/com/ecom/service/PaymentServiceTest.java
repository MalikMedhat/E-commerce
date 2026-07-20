package com.ecom.service;

import com.ecom.model.Payment;
import com.ecom.repository.PaymentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @InjectMocks
    private PaymentService paymentService;

    private Payment payment;

    @BeforeEach
    void setUp() {
        payment = new Payment();
        payment.setId(1L);
        payment.setOrderId(1L);
        payment.setAmount(199.99);
        payment.setProvider(Payment.PaymentProvider.STRIPE);
        payment.setStatus(Payment.PaymentStatus.PENDING);
    }

    @Test
    void testCreatePayment_Success() {
        when(paymentRepository.save(any())).thenReturn(payment);

        Payment result = paymentService.createPayment(1L, 199.99, Payment.PaymentProvider.STRIPE);

        assertNotNull(result);
        assertEquals(Payment.PaymentStatus.PENDING, result.getStatus());
        assertEquals(Payment.PaymentProvider.STRIPE, result.getProvider());
        verify(paymentRepository, times(1)).save(any());
    }

    @Test
    void testGetPaymentByOrderId_Success() {
        when(paymentRepository.findByOrderId(1L)).thenReturn(Optional.of(payment));

        Payment result = paymentService.getPaymentByOrderId(1L);

        assertNotNull(result);
        assertEquals(1L, result.getOrderId());
    }

    @Test
    void testGetPaymentByOrderId_NotFound() {
        when(paymentRepository.findByOrderId(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> paymentService.getPaymentByOrderId(1L));
    }

    @Test
    void testUpdatePaymentStatus() {
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(payment));
        when(paymentRepository.save(any())).thenReturn(payment);

        Payment result = paymentService.updatePaymentStatus(1L, Payment.PaymentStatus.COMPLETED);

        assertEquals(Payment.PaymentStatus.COMPLETED, result.getStatus());
        verify(paymentRepository, times(1)).save(any());
    }

    @Test
    void testUpdatePaymentWithTransaction() {
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(payment));
        when(paymentRepository.save(any())).thenReturn(payment);

        Payment result = paymentService.updatePaymentWithTransaction(1L, "stripe_pi_123", Payment.PaymentStatus.COMPLETED);

        assertEquals("stripe_pi_123", result.getTransactionId());
        assertEquals(Payment.PaymentStatus.COMPLETED, result.getStatus());
        verify(paymentRepository, times(1)).save(any());
    }

    @Test
    void testGetPaymentByTransactionId_Success() {
        payment.setTransactionId("stripe_pi_123");
        when(paymentRepository.findByTransactionId("stripe_pi_123")).thenReturn(Optional.of(payment));

        Payment result = paymentService.getPaymentByTransactionId("stripe_pi_123");

        assertNotNull(result);
        assertEquals("stripe_pi_123", result.getTransactionId());
    }

    @Test
    void testGetPaymentByTransactionId_NotFound() {
        when(paymentRepository.findByTransactionId("stripe_pi_invalid")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> paymentService.getPaymentByTransactionId("stripe_pi_invalid"));
    }
}
