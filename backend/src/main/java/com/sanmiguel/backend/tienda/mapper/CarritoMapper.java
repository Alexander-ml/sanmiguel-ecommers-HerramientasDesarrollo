package com.sanmiguel.backend.tienda.mapper;

import com.sanmiguel.backend.tienda.dto.CarritoResponseDTO;
import com.sanmiguel.backend.tienda.entity.Carrito;
import org.springframework.stereotype.Component;

@Component
public class CarritoMapper {

    public CarritoResponseDTO toResponse(Carrito carrito) {
        return new CarritoResponseDTO(
                carrito.getId(),
                carrito.getClienteId(),
                carrito.getClienteId() == null,
                carrito.getFechaCreacion(),
                carrito.getFechaActualizacion()
        );
    }
}
