package com.sanmiguel.backend.auth.security;

import com.sanmiguel.backend.auth.entity.Sesion;
import com.sanmiguel.backend.auth.entity.Usuario;
import com.sanmiguel.backend.auth.repository.SesionRepository;
import com.sanmiguel.backend.common.exception.TokenInvalidoException;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
public class RefreshTokenService {

    private final SesionRepository sesionRepository;
    private final RefreshTokenProperties properties;
    private final SecureRandom secureRandom = new SecureRandom();

    public RefreshTokenService(SesionRepository sesionRepository, RefreshTokenProperties properties) {
        this.sesionRepository = sesionRepository;
        this.properties = properties;
    }

    /** Genera un refresh token nuevo, guarda solo su hash, y devuelve el token en claro
     *  — esta es la única vez que existe en texto plano, para entregárselo al cliente. */
    public String generar(Usuario usuario) {
        String tokenEnClaro = generarTokenAleatorio();
        String hash = hashear(tokenEnClaro);

        LocalDateTime expiracion = LocalDateTime.now().plusDays(properties.getExpirationDays());
        sesionRepository.save(new Sesion(usuario, hash, expiracion));

        return tokenEnClaro;
    }

    /** Valida el token recibido, lo revoca (rotación: un refresh token se usa una sola vez),
     *  y devuelve el Usuario dueño — quien llama a esto es responsable de generar el reemplazo. */
    public Usuario validarYRevocar(String tokenEnClaro) {
        String hash = hashear(tokenEnClaro);
        Sesion sesion = sesionRepository.findByTokenHash(hash)
                .orElseThrow(() -> new TokenInvalidoException("Refresh token inválido"));

        if (!sesion.esValida()) {
            throw new TokenInvalidoException("Refresh token expirado o ya utilizado");
        }

        sesion.revocar();
        sesionRepository.save(sesion);
        return sesion.getUsuario();
    }

    /** Para logout: revoca si existe, sin lanzar error si ya no está — cerrar sesión
     *  con un token que ya no es válido no debería tratarse como un fallo real. */
    public void revocarSiExiste(String tokenEnClaro) {
        String hash = hashear(tokenEnClaro);
        sesionRepository.findByTokenHash(hash).ifPresent(sesion -> {
            sesion.revocar();
            sesionRepository.save(sesion);
        });
    }

    private String generarTokenAleatorio() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hashear(String valor) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(valor.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            // SHA-256 es un algoritmo estándar de la JVM — esto nunca debería pasar en la práctica
            throw new IllegalStateException("SHA-256 no disponible", e);
        }
    }
}