package com.sanmiguel.backend.auth.dto;

public record AuthTokensDTO(
        String token,
        String tipo,
        long expiraEnMs,
        String refreshToken
) {}