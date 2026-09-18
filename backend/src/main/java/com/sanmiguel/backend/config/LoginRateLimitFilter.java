package com.sanmiguel.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sanmiguel.backend.common.dto.ApiResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class LoginRateLimitFilter extends OncePerRequestFilter {

    private static final String RUTA_LOGIN = "/api/auth/login";

    private final RateLimitProperties properties;
    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();
    private final ConcurrentHashMap<String, VentanaIntentos> intentosPorIp = new ConcurrentHashMap<>();

    public LoginRateLimitFilter(RateLimitProperties properties) {
        this.properties = properties;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {

        boolean esLogin = "POST".equalsIgnoreCase(request.getMethod()) && RUTA_LOGIN.equals(request.getRequestURI());

        if (esLogin && excedioLimite(request.getRemoteAddr())) {
            response.setStatus(429);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write(objectMapper.writeValueAsString(
                    ApiResponse.error("Demasiados intentos de inicio de sesión. Intenta más tarde.", "RATE_LIMITED")));
            return;
        }

        filterChain.doFilter(request, response);
    }

    private synchronized boolean excedioLimite(String ip) {
        Instant ahora = Instant.now();
        VentanaIntentos ventana = intentosPorIp.computeIfAbsent(ip, k -> new VentanaIntentos(ahora));

        long minutosTranscurridos = Duration.between(ventana.inicio, ahora).toMinutes();
        if (minutosTranscurridos >= properties.getVentanaMinutos()) {
            ventana.inicio = ahora;
            ventana.conteo = 0;
        }

        ventana.conteo++;
        return ventana.conteo > properties.getMaxIntentos();
    }

    private static class VentanaIntentos {
        Instant inicio;
        int conteo = 0;

        VentanaIntentos(Instant inicio) {
            this.inicio = inicio;
        }
    }
}