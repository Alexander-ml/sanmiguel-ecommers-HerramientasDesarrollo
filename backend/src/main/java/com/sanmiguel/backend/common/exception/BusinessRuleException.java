package com.sanmiguel.backend.common.exception;

import org.springframework.http.HttpStatus;

public class BusinessRuleException extends ApiException {

    public BusinessRuleException(String message) {
        super(message, HttpStatus.CONFLICT, "BUSINESS_RULE_VIOLATION");
    }

    // Para cuando el módulo que la lanza quiere un código más específico
    // que el genérico, ej. new BusinessRuleException("...", "EMAIL_YA_EXISTE")
    public BusinessRuleException(String message, String errorCode) {
        super(message, HttpStatus.CONFLICT, errorCode);
    }
}