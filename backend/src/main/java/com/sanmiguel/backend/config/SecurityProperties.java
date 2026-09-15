package com.sanmiguel.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Valores de bloqueo por intentos fallidos, configurables sin tocar código
 * (app.security.* en application.yaml).
 * <p>
 * Nota de alcance: la tabla parametros_seguridad (módulo Configuración
 * General) ya está diseñada para guardar estos mismos valores editables
 * en caliente desde un panel de administración. Por ahora AuthService los
 * lee de acá porque el módulo Configuración General todavía no existe —
 * el día que se construya, este bean se reemplaza por una llamada al
 * ConfiguracionService de ese módulo (nunca leyendo su tabla directamente,
 * respetando la regla de "una entidad, un dueño").
 */
@Component
@ConfigurationProperties(prefix = "app.security")
public class SecurityProperties {

    private int maxFailedAttempts = 5;
    private int lockoutMinutes = 15;

    public int getMaxFailedAttempts() {
        return maxFailedAttempts;
    }

    public void setMaxFailedAttempts(int maxFailedAttempts) {
        this.maxFailedAttempts = maxFailedAttempts;
    }

    public int getLockoutMinutes() {
        return lockoutMinutes;
    }

    public void setLockoutMinutes(int lockoutMinutes) {
        this.lockoutMinutes = lockoutMinutes;
    }
}