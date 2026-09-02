# Sistema de Gestión Comercial y E-commerce

Sistema que centraliza inventario, compras, ventas y un canal de venta en línea para SAN MIGUEL, tienda de ropa. Backend en Java + Spring Boot, frontend en React + TypeScript, MySQL como base de datos, todo contenerizado con Docker.

---

## Stack

| Componente | Tecnología |
|---|---|
| Backend | Java 21 + Spring Boot 4.1.x |
| Frontend | React 19 + TypeScript + Vite |
| Base de datos | MySQL 8.4, migraciones con Flyway |
| Estilos | Bootstrap 5 (`react-bootstrap`) |
| Infraestructura | Docker + Docker Compose |
| Documentación de API | OpenAPI/Swagger (generado automático con springdoc) |

---

## Estructura del repositorio

```
backend/    → API REST (Spring Boot), organizada por módulo de negocio
frontend/   → Interfaz (React), organizada por feature, en espejo con backend/
infra/      → docker-compose.yml, Dockerfiles de referencia, .env.example
docs/       → toda la documentación del proyecto (este índice y las guías)
```

---

## Requisitos previos

- **Docker Desktop** instalado y corriendo (todo el sistema corre sobre esto)
- **Git** con llave SSH configurada
- **Java 21** y **Node 20 LTS** solo necesarios si van a correr el backend o el frontend fuera de Docker (perfil `dev`), no para el uso normal del día a día
- **MySQL Workbench** (opcional) para mirar la base de datos directamente

---

## Puesta en marcha (primera vez)

```bash
git clone git@github.com:<tu-usuario>/sanmiguel-ecommers-HerramientasDesarrollo.git
cd sanmiguel-ecommers-HerramientasDesarrollo/infra
cp .env.example .env
```

Abre `infra/.env` y completa las contraseñas reales (nunca dejes `changeme` en un ambiente que no sea tu máquina personal).

```bash
docker compose up --build
```

La primera vez tarda varios minutos está descargando imágenes base y compilando ambos proyectos. Cuando termine, valida estos 3 puntos:

```bash
docker compose ps                              # los 3 contenedores → running / healthy
curl http://localhost:8080/actuator/health      # {"status":"UP"}
```

Y abre `http://localhost` en el navegador.

---

## Flujo de trabajo diario (resumen)

```bash
git switch develop
git pull origin develop
git switch -c feature/modulo-descripcion     # o fix/, chore/, docs/, refactor/
# ... trabajas, commits pequeños con Conventional Commits ...
git push origin feature/modulo-descripcion
# abres el Pull Request hacia develop desde GitHub
```

`main` y `develop` están protegidas nadie hace push directo ahí, ni siquiera con permisos de administrador. Todo entra por Pull Request con al menos 1 revisión.

---

## Reglas que no se negocian (resumen de todas las guías)

```
Nunca push directo a main ni a develop, siempre Pull Request con revisión.
Nunca ddl-auto: update Flyway es la única fuente de verdad del esquema.
Nunca editar una migración ya aplicada se corrige con una nueva.
Nunca crear o modificar tablas a mano desde MySQL Workbench.
Nunca commitear el .env solo .env.example, sin datos reales.
Nunca mezclar dos tareas o dos módulos en el mismo Pull Request.
```
