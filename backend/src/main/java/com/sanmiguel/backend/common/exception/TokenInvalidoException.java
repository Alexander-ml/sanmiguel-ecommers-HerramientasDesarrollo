package com.sanmiguel.backend.common.exception;

import org.springframework.http.HttpStatus;

public class TokenInvalidoException extends ApiException {
    public TokenInvalidoException(String message) {
        super(message, HttpStatus.UNAUTHORIZED, "REFRESH_TOKEN_INVALIDO");
    }
}