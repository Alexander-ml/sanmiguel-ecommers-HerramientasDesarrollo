-- Usuario de prueba — SOLO para desarrollo local (perfil dev).
-- Nunca se carga en el perfil docker/producción: application-docker.yml
-- no incluye db/seed-dev en spring.flyway.locations (Guía de Base de Datos,
-- sección 7).
--
-- Credenciales de prueba:
--   correo:      admin@sanmiguel.test
--   contraseña:  Admin123!
--
-- El hash de abajo es BCrypt real de "Admin123!" — nunca se guarda una
-- contraseña en texto plano, ni siquiera en un dato de prueba.
--
-- El subquery (SELECT id FROM roles WHERE nombre = 'Administrador') evita
-- hardcodear el id del rol — depende de que R__cargar_roles_iniciales.sql
-- ya haya corrido antes. Como Flyway ejecuta los repetibles en orden
-- alfabético de su nombre ("cargar_roles..." antes que "usuario_admin..."),
-- ese orden ya queda garantizado sin configuración extra.

INSERT INTO usuarios (nombre, correo, contrasena_hash, rol_id)
SELECT
    'Administrador de Prueba',
    'admin@sanmiguel.test',
    '$2b$10$VNqML0GdvmvGX8iHDP6SXeXiaGmw02wnAyjZ8Eqt27KG/ckwK/VTe',
    (SELECT id FROM roles WHERE nombre = 'Administrador')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);
