package com.sanmiguel.backend.auth.dto;

public record LoginResponse(
        AuthTokensDTO tokens,
        UsuarioResumenDTO usuario
) {}