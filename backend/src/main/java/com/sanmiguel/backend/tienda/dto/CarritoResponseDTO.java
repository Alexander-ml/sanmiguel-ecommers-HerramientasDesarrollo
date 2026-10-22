package com.sanmiguel.backend.tienda.dto;

import java.time.LocalDateTime;

public record CarritoResponseDTO(
        Long id,
        Long clienteId,
        boolean invitado,
        LocalDateTime fechaCreacion,
        LocalDateTime fechaActualizacion
) {
}
