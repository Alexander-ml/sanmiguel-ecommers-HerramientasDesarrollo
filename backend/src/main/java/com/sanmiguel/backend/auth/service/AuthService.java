package com.sanmiguel.backend.auth.service;

import com.sanmiguel.backend.auth.dto.LoginRequest;
import com.sanmiguel.backend.auth.dto.LoginResponse;
import com.sanmiguel.backend.auth.dto.UsuarioResumenDTO;
import com.sanmiguel.backend.auth.entity.Usuario;
import com.sanmiguel.backend.auth.repository.UsuarioRepository;
import com.sanmiguel.backend.auth.security.JwtProperties;
import com.sanmiguel.backend.auth.security.JwtTokenProvider;
import com.sanmiguel.backend.common.exception.AccountDisabledException;
import com.sanmiguel.backend.common.exception.AccountLockedException;
import com.sanmiguel.backend.config.SecurityProperties;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtProperties jwtProperties;
    private final SecurityProperties securityProperties;

    public AuthService(UsuarioRepository usuarioRepository,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider jwtTokenProvider,
                       JwtProperties jwtProperties,
                       SecurityProperties securityProperties) {
        this.usuarioRepository = usuarioRepository;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.jwtProperties = jwtProperties;
        this.securityProperties = securityProperties;
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByCorreo(request.correo())
                .orElseThrow(() -> new BadCredentialsException("Credenciales inválidas"));

        if (usuario.estaBloqueado()) {
            throw new AccountLockedException("Cuenta bloqueada temporalmente por intentos fallidos. Intenta más tarde.");
        }
        if (!usuario.estaActivo()) {
            throw new AccountDisabledException("Cuenta inactiva. Contacta al administrador.");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.correo(), request.contrasena()));
        } catch (BadCredentialsException ex) {
            registrarIntentoFallido(usuario);
            throw ex;
        }

        usuario.reiniciarIntentosFallidos();
        usuarioRepository.save(usuario);

        String token = jwtTokenProvider.generarToken(usuario.getCorreo(), usuario.getRol().getNombre());
        UsuarioResumenDTO resumen = new UsuarioResumenDTO(
                usuario.getId(), usuario.getNombre(), usuario.getCorreo(), usuario.getRol().getNombre());

        return new LoginResponse(token, "Bearer", jwtProperties.getExpirationMs(), resumen);
    }

    private void registrarIntentoFallido(Usuario usuario) {
        usuario.registrarIntentoFallido();
        if (usuario.getIntentosFallidosConsecutivos() >= securityProperties.getMaxFailedAttempts()) {
            usuario.bloquearHasta(LocalDateTime.now().plusMinutes(securityProperties.getLockoutMinutes()));
        }
        usuarioRepository.save(usuario);
    }
}