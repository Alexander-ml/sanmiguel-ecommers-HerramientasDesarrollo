package com.sanmiguel.backend.tienda.controller;

import com.sanmiguel.backend.common.dto.ApiResponse;
import com.sanmiguel.backend.tienda.dto.CarritoResponseDTO;
import com.sanmiguel.backend.tienda.service.CarritoService;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tienda/carritos")
@PreAuthorize("hasRole('ADMINISTRADOR')")
public class CarritoController {

    private final CarritoService carritoService;

    public CarritoController(CarritoService carritoService) {
        this.carritoService = carritoService;
    }

    @GetMapping
    public ApiResponse<List<CarritoResponseDTO>> listar() {
        return ApiResponse.success(carritoService.listar());
    }

    @GetMapping("/{id}")
    public ApiResponse<CarritoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ApiResponse.success(carritoService.buscarPorId(id));
    }
}
