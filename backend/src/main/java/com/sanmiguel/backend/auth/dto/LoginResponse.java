package com.sanmiguel.backend.auth.dto;

public record LoginResponse(
        String token,
        String tipo,
        long expiraEnMs,
        UsuarioResumenDTO usuario
) {}