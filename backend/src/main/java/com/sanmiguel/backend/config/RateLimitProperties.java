package com.sanmiguel.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.rate-limit.login")
public class RateLimitProperties {

    private int maxIntentos = 10;
    private int ventanaMinutos = 15;

    public int getMaxIntentos() { return maxIntentos; }
    public void setMaxIntentos(int maxIntentos) { this.maxIntentos = maxIntentos; }
    public int getVentanaMinutos() { return ventanaMinutos; }
    public void setVentanaMinutos(int ventanaMinutos) { this.ventanaMinutos = ventanaMinutos; }
}