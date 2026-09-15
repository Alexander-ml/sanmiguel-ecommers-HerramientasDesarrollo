package com.sanmiguel.backend.auth.dto;

public record UsuarioResumenDTO(
        Long id,
        String nombre,
        String correo,
        String rol
) {}