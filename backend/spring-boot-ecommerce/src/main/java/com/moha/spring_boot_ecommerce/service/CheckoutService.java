package com.moha.spring_boot_ecommerce.service;

import com.moha.spring_boot_ecommerce.dto.Purchase;
import com.moha.spring_boot_ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}
