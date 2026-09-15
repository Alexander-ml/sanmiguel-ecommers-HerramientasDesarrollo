-- Roles base del sistema — Usuarios y Seguridad.
-- Repetible (R__) porque son datos de referencia que deben existir siempre,
-- no un cambio de estructura que pasa una sola vez.
--
-- ON DUPLICATE KEY UPDATE hace que este script se pueda re-ejecutar sin
-- error si Flyway lo vuelve a correr (por ejemplo, si algún día se agrega
-- un cuarto rol acá mismo) — nombre es UNIQUE, así que nunca duplica filas.

INSERT INTO roles (nombre) VALUES
    ('Administrador'),
    ('Vendedor'),
    ('Almacenero')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);
