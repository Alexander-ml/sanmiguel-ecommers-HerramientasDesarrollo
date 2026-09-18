-- Mejora 3: agrega la columna que respalda @Version en la entidad Usuario.
-- DEFAULT 0 hace que las filas ya existentes (incluido el usuario de prueba
-- del seed-dev) queden con un valor válido sin romper nada.

ALTER TABLE usuarios
    ADD COLUMN version BIGINT NOT NULL DEFAULT 0 COMMENT 'Control de concurrencia optimista (JPA @Version).';