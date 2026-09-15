package com.sanmiguel.backend.common.exception;

import org.springframework.http.HttpStatus;

public class AccountLockedException extends ApiException {
    public AccountLockedException(String message) {
        super(message, HttpStatus.LOCKED); // 423 — más preciso que un 401 genérico
    }
}