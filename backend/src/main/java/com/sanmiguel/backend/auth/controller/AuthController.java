package com.sanmiguel.backend.auth.controller;

import com.sanmiguel.backend.auth.dto.AuthTokensDTO;
import com.sanmiguel.backend.auth.dto.LoginRequest;
import com.sanmiguel.backend.auth.dto.LoginResponse;
import com.sanmiguel.backend.auth.dto.RefreshTokenRequest;
import com.sanmiguel.backend.auth.dto.UsuarioResumenDTO;
import com.sanmiguel.backend.auth.entity.Usuario;
import com.sanmiguel.backend.auth.security.UserPrincipal;
import com.sanmiguel.backend.auth.service.AuthService;
import com.sanmiguel.backend.common.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Inicio de sesión exitoso"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthTokensDTO>> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        AuthTokensDTO tokens = authService.refresh(request);
        return ResponseEntity.ok(ApiResponse.success(tokens, "Token renovado"));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@Valid @RequestBody RefreshTokenRequest request) {
        authService.logout(request);
        return ResponseEntity.ok(ApiResponse.success(null, "Sesión cerrada"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UsuarioResumenDTO>> me(@AuthenticationPrincipal UserPrincipal principal) {
        Usuario usuario = principal.getUsuario();
        UsuarioResumenDTO resumen = new UsuarioResumenDTO(
                usuario.getId(), usuario.getNombre(), usuario.getCorreo(), usuario.getRol().getNombre());
        return ResponseEntity.ok(ApiResponse.success(resumen));
    }
}