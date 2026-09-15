package com.sanmiguel.backend.common.exception;

import org.springframework.http.HttpStatus;

public class BusinessRuleException extends ApiException {
    public BusinessRuleException(String message) {
        super(message, HttpStatus.CONFLICT);
    }
}