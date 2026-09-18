package com.sanmiguel.backend.auth.controller;

import com.sanmiguel.backend.auth.dto.UsuarioCreateRequest;
import com.sanmiguel.backend.auth.dto.UsuarioResumenDTO;
import com.sanmiguel.backend.auth.service.UsuarioService;
import com.sanmiguel.backend.common.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<ApiResponse<UsuarioResumenDTO>> crear(@Valid @RequestBody UsuarioCreateRequest request) {
        UsuarioResumenDTO creado = usuarioService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(creado, "Usuario creado"));
    }
}