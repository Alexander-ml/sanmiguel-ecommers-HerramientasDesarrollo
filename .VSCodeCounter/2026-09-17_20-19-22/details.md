# Details

Date : 2026-09-17 20:19:22

Directory /home/aml/Documentos/Proyectos/Universidad/sanmiguel-ecommers/sanmiguel-ecommers-HerramientasDesarrollo

Total : 330 files,  31595 codes, 1426 comments, 3126 blanks, all 36147 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [README.md](/README.md) | Markdown | 64 | 0 | 26 | 90 |
| [backend/.mvn/wrapper/maven-wrapper.properties](/backend/.mvn/wrapper/maven-wrapper.properties) | Properties | 3 | 0 | 1 | 4 |
| [backend/Dockerfile](/backend/Dockerfile) | Docker | 12 | 0 | 2 | 14 |
| [backend/mvnw.cmd](/backend/mvnw.cmd) | Batch | 139 | 26 | 25 | 190 |
| [backend/pom.xml](/backend/pom.xml) | XML | 208 | 0 | 4 | 212 |
| [backend/src/main/java/com/sanmiguel/backend/BackendApplication.java](/backend/src/main/java/com/sanmiguel/backend/BackendApplication.java) | Java | 9 | 0 | 5 | 14 |
| [backend/src/main/java/com/sanmiguel/backend/auth/controller/AuthController.java](/backend/src/main/java/com/sanmiguel/backend/auth/controller/AuthController.java) | Java | 48 | 0 | 8 | 56 |
| [backend/src/main/java/com/sanmiguel/backend/auth/controller/UsuarioController.java](/backend/src/main/java/com/sanmiguel/backend/auth/controller/UsuarioController.java) | Java | 27 | 0 | 5 | 32 |
| [backend/src/main/java/com/sanmiguel/backend/auth/dto/AuthTokensDTO.java](/backend/src/main/java/com/sanmiguel/backend/auth/dto/AuthTokensDTO.java) | Java | 7 | 0 | 1 | 8 |
| [backend/src/main/java/com/sanmiguel/backend/auth/dto/LoginRequest.java](/backend/src/main/java/com/sanmiguel/backend/auth/dto/LoginRequest.java) | Java | 10 | 0 | 3 | 13 |
| [backend/src/main/java/com/sanmiguel/backend/auth/dto/LoginResponse.java](/backend/src/main/java/com/sanmiguel/backend/auth/dto/LoginResponse.java) | Java | 5 | 0 | 1 | 6 |
| [backend/src/main/java/com/sanmiguel/backend/auth/dto/RefreshTokenRequest.java](/backend/src/main/java/com/sanmiguel/backend/auth/dto/RefreshTokenRequest.java) | Java | 6 | 0 | 2 | 8 |
| [backend/src/main/java/com/sanmiguel/backend/auth/dto/UsuarioCreateRequest.java](/backend/src/main/java/com/sanmiguel/backend/auth/dto/UsuarioCreateRequest.java) | Java | 17 | 0 | 5 | 22 |
| [backend/src/main/java/com/sanmiguel/backend/auth/dto/UsuarioResumenDTO.java](/backend/src/main/java/com/sanmiguel/backend/auth/dto/UsuarioResumenDTO.java) | Java | 7 | 0 | 1 | 8 |
| [backend/src/main/java/com/sanmiguel/backend/auth/entity/Permiso.java](/backend/src/main/java/com/sanmiguel/backend/auth/entity/Permiso.java) | Java | 34 | 1 | 11 | 46 |
| [backend/src/main/java/com/sanmiguel/backend/auth/entity/Rol.java](/backend/src/main/java/com/sanmiguel/backend/auth/entity/Rol.java) | Java | 27 | 1 | 8 | 36 |
| [backend/src/main/java/com/sanmiguel/backend/auth/entity/Sesion.java](/backend/src/main/java/com/sanmiguel/backend/auth/entity/Sesion.java) | Java | 49 | 0 | 14 | 63 |
| [backend/src/main/java/com/sanmiguel/backend/auth/entity/Usuario.java](/backend/src/main/java/com/sanmiguel/backend/auth/entity/Usuario.java) | Java | 83 | 5 | 22 | 110 |
| [backend/src/main/java/com/sanmiguel/backend/auth/repository/RolRepository.java](/backend/src/main/java/com/sanmiguel/backend/auth/repository/RolRepository.java) | Java | 7 | 0 | 2 | 9 |
| [backend/src/main/java/com/sanmiguel/backend/auth/repository/SesionRepository.java](/backend/src/main/java/com/sanmiguel/backend/auth/repository/SesionRepository.java) | Java | 9 | 0 | 3 | 12 |
| [backend/src/main/java/com/sanmiguel/backend/auth/repository/UsuarioRepository.java](/backend/src/main/java/com/sanmiguel/backend/auth/repository/UsuarioRepository.java) | Java | 9 | 0 | 3 | 12 |
| [backend/src/main/java/com/sanmiguel/backend/auth/security/CustomUserDetailsService.java](/backend/src/main/java/com/sanmiguel/backend/auth/security/CustomUserDetailsService.java) | Java | 19 | 0 | 5 | 24 |
| [backend/src/main/java/com/sanmiguel/backend/auth/security/JwtAuthenticationFilter.java](/backend/src/main/java/com/sanmiguel/backend/auth/security/JwtAuthenticationFilter.java) | Java | 45 | 0 | 13 | 58 |
| [backend/src/main/java/com/sanmiguel/backend/auth/security/JwtProperties.java](/backend/src/main/java/com/sanmiguel/backend/auth/security/JwtProperties.java) | Java | 13 | 0 | 4 | 17 |
| [backend/src/main/java/com/sanmiguel/backend/auth/security/JwtTokenProvider.java](/backend/src/main/java/com/sanmiguel/backend/auth/security/JwtTokenProvider.java) | Java | 46 | 0 | 10 | 56 |
| [backend/src/main/java/com/sanmiguel/backend/auth/security/RefreshTokenProperties.java](/backend/src/main/java/com/sanmiguel/backend/auth/security/RefreshTokenProperties.java) | Java | 14 | 0 | 5 | 19 |
| [backend/src/main/java/com/sanmiguel/backend/auth/security/RefreshTokenService.java](/backend/src/main/java/com/sanmiguel/backend/auth/security/RefreshTokenService.java) | Java | 61 | 7 | 14 | 82 |
| [backend/src/main/java/com/sanmiguel/backend/auth/security/UserPrincipal.java](/backend/src/main/java/com/sanmiguel/backend/auth/security/UserPrincipal.java) | Java | 45 | 2 | 13 | 60 |
| [backend/src/main/java/com/sanmiguel/backend/auth/service/AuthService.java](/backend/src/main/java/com/sanmiguel/backend/auth/service/AuthService.java) | Java | 95 | 0 | 17 | 112 |
| [backend/src/main/java/com/sanmiguel/backend/auth/service/UsuarioService.java](/backend/src/main/java/com/sanmiguel/backend/auth/service/UsuarioService.java) | Java | 36 | 0 | 8 | 44 |
| [backend/src/main/java/com/sanmiguel/backend/common/converter/EstadoActivoInactivoConverter.java](/backend/src/main/java/com/sanmiguel/backend/common/converter/EstadoActivoInactivoConverter.java) | Java | 15 | 0 | 4 | 19 |
| [backend/src/main/java/com/sanmiguel/backend/common/dto/ApiResponse.java](/backend/src/main/java/com/sanmiguel/backend/common/dto/ApiResponse.java) | Java | 38 | 0 | 10 | 48 |
| [backend/src/main/java/com/sanmiguel/backend/common/enums/EstadoActivoInactivo.java](/backend/src/main/java/com/sanmiguel/backend/common/enums/EstadoActivoInactivo.java) | Java | 5 | 0 | 1 | 6 |
| [backend/src/main/java/com/sanmiguel/backend/common/exception/AccountDisabledException.java](/backend/src/main/java/com/sanmiguel/backend/common/exception/AccountDisabledException.java) | Java | 7 | 0 | 2 | 9 |
| [backend/src/main/java/com/sanmiguel/backend/common/exception/AccountLockedException.java](/backend/src/main/java/com/sanmiguel/backend/common/exception/AccountLockedException.java) | Java | 7 | 0 | 2 | 9 |
| [backend/src/main/java/com/sanmiguel/backend/common/exception/ApiException.java](/backend/src/main/java/com/sanmiguel/backend/common/exception/ApiException.java) | Java | 17 | 0 | 6 | 23 |
| [backend/src/main/java/com/sanmiguel/backend/common/exception/BusinessRuleException.java](/backend/src/main/java/com/sanmiguel/backend/common/exception/BusinessRuleException.java) | Java | 10 | 2 | 4 | 16 |
| [backend/src/main/java/com/sanmiguel/backend/common/exception/GlobalExceptionHandler.java](/backend/src/main/java/com/sanmiguel/backend/common/exception/GlobalExceptionHandler.java) | Java | 57 | 4 | 11 | 72 |
| [backend/src/main/java/com/sanmiguel/backend/common/exception/ResourceNotFoundException.java](/backend/src/main/java/com/sanmiguel/backend/common/exception/ResourceNotFoundException.java) | Java | 7 | 0 | 2 | 9 |
| [backend/src/main/java/com/sanmiguel/backend/common/exception/TokenInvalidoException.java](/backend/src/main/java/com/sanmiguel/backend/common/exception/TokenInvalidoException.java) | Java | 7 | 0 | 2 | 9 |
| [backend/src/main/java/com/sanmiguel/backend/config/CorsProperties.java](/backend/src/main/java/com/sanmiguel/backend/config/CorsProperties.java) | Java | 15 | 0 | 6 | 21 |
| [backend/src/main/java/com/sanmiguel/backend/config/LoginRateLimitFilter.java](/backend/src/main/java/com/sanmiguel/backend/config/LoginRateLimitFilter.java) | Java | 57 | 0 | 15 | 72 |
| [backend/src/main/java/com/sanmiguel/backend/config/OpenApiConfig.java](/backend/src/main/java/com/sanmiguel/backend/config/OpenApiConfig.java) | Java | 27 | 0 | 4 | 31 |
| [backend/src/main/java/com/sanmiguel/backend/config/RateLimitProperties.java](/backend/src/main/java/com/sanmiguel/backend/config/RateLimitProperties.java) | Java | 13 | 0 | 4 | 17 |
| [backend/src/main/java/com/sanmiguel/backend/config/RestAccessDeniedHandler.java](/backend/src/main/java/com/sanmiguel/backend/config/RestAccessDeniedHandler.java) | Java | 22 | 0 | 5 | 27 |
| [backend/src/main/java/com/sanmiguel/backend/config/RestAuthenticationEntryPoint.java](/backend/src/main/java/com/sanmiguel/backend/config/RestAuthenticationEntryPoint.java) | Java | 22 | 0 | 5 | 27 |
| [backend/src/main/java/com/sanmiguel/backend/config/SecurityConfig.java](/backend/src/main/java/com/sanmiguel/backend/config/SecurityConfig.java) | Java | 75 | 0 | 11 | 86 |
| [backend/src/main/java/com/sanmiguel/backend/config/SecurityProperties.java](/backend/src/main/java/com/sanmiguel/backend/config/SecurityProperties.java) | Java | 21 | 12 | 7 | 40 |
| [backend/src/main/resources/application-dev.yml](/backend/src/main/resources/application-dev.yml) | YAML | 10 | 5 | 2 | 17 |
| [backend/src/main/resources/application-docker.yml](/backend/src/main/resources/application-docker.yml) | YAML | 3 | 1 | 2 | 6 |
| [backend/src/main/resources/application.yaml](/backend/src/main/resources/application.yaml) | YAML | 33 | 8 | 6 | 47 |
| [backend/src/main/resources/db/migration/R\_\_cargar\_roles\_iniciales.sql](/backend/src/main/resources/db/migration/R__cargar_roles_iniciales.sql) | MS SQL | 5 | 7 | 2 | 14 |
| [backend/src/main/resources/db/migration/R\_\_usuario\_admin\_prueba.sql](/backend/src/main/resources/db/migration/R__usuario_admin_prueba.sql) | MS SQL | 7 | 17 | 2 | 26 |
| [backend/src/main/resources/db/migration/V202609061315\_\_esquema\_inicial.sql](/backend/src/main/resources/db/migration/V202609061315__esquema_inicial.sql) | MS SQL | 457 | 43 | 47 | 547 |
| [backend/src/main/resources/db/migration/V202609161000\_\_agregar\_version\_usuarios.sql](/backend/src/main/resources/db/migration/V202609161000__agregar_version_usuarios.sql) | MS SQL | 2 | 3 | 1 | 6 |
| [backend/src/test/java/com/sanmiguel/backend/BackendApplicationTests.java](/backend/src/test/java/com/sanmiguel/backend/BackendApplicationTests.java) | Java | 11 | 0 | 5 | 16 |
| [backend/src/test/java/com/sanmiguel/backend/TestBackendApplication.java](/backend/src/test/java/com/sanmiguel/backend/TestBackendApplication.java) | Java | 7 | 0 | 5 | 12 |
| [backend/src/test/java/com/sanmiguel/backend/TestcontainersConfiguration.java](/backend/src/test/java/com/sanmiguel/backend/TestcontainersConfiguration.java) | Java | 14 | 0 | 5 | 19 |
| [docs/decisiones/1. Guía de Ramas y Flujo de Trabajo.md](/docs/decisiones/1.%20Gu%C3%ADa%20de%20Ramas%20y%20Flujo%20de%20Trabajo.md) | Markdown | 125 | 0 | 41 | 166 |
| [docs/decisiones/2. Guía de Comandos Git y Flujo de Trabajo Diario.md](/docs/decisiones/2.%20Gu%C3%ADa%20de%20Comandos%20Git%20y%20Flujo%20de%20Trabajo%20Diario.md) | Markdown | 131 | 0 | 53 | 184 |
| [docs/decisiones/3. Guía Operativa de Docker.md](/docs/decisiones/3.%20Gu%C3%ADa%20Operativa%20de%20Docker.md) | Markdown | 152 | 0 | 63 | 215 |
| [docs/decisiones/4. Guía de Dependencias y Stack Tecnológico.md](/docs/decisiones/4.%20Gu%C3%ADa%20de%20Dependencias%20y%20Stack%20Tecnol%C3%B3gico.md) | Markdown | 43 | 0 | 10 | 53 |
| [docs/decisiones/5. Guía de Estructura del Proyecto.md](/docs/decisiones/5.%20Gu%C3%ADa%20de%20Estructura%20del%20Proyecto.md) | Markdown | 180 | 0 | 47 | 227 |
| [frontend/Dockerfile](/frontend/Dockerfile) | Docker | 9 | 0 | 2 | 11 |
| [frontend/README.md](/frontend/README.md) | Markdown | 60 | 0 | 16 | 76 |
| [frontend/eslint.config.js](/frontend/eslint.config.js) | JavaScript | 21 | 0 | 2 | 23 |
| [frontend/index.html](/frontend/index.html) | HTML | 13 | 0 | 1 | 14 |
| [frontend/package-lock.json](/frontend/package-lock.json) | JSON | 3,197 | 0 | 1 | 3,198 |
| [frontend/package.json](/frontend/package.json) | JSON | 48 | 0 | 1 | 49 |
| [frontend/public/favicon.svg](/frontend/public/favicon.svg) | XML | 1 | 0 | 0 | 1 |
| [frontend/public/icons.svg](/frontend/public/icons.svg) | XML | 24 | 0 | 1 | 25 |
| [frontend/public/mockServiceWorker.js](/frontend/public/mockServiceWorker.js) | JavaScript | 232 | 76 | 54 | 362 |
| [frontend/src/App.css](/frontend/src/App.css) | PostCSS | 0 | 0 | 1 | 1 |
| [frontend/src/App.tsx](/frontend/src/App.tsx) | TypeScript JSX | 11 | 0 | 2 | 13 |
| [frontend/src/api/client.ts](/frontend/src/api/client.ts) | TypeScript | 39 | 12 | 6 | 57 |
| [frontend/src/assets/vite.svg](/frontend/src/assets/vite.svg) | XML | 1 | 0 | 1 | 2 |
| [frontend/src/components/feedback/ConfirmDialog.tsx](/frontend/src/components/feedback/ConfirmDialog.tsx) | TypeScript JSX | 40 | 5 | 3 | 48 |
| [frontend/src/components/feedback/EmptyState.tsx](/frontend/src/components/feedback/EmptyState.tsx) | TypeScript JSX | 21 | 4 | 3 | 28 |
| [frontend/src/components/feedback/ErrorState.tsx](/frontend/src/components/feedback/ErrorState.tsx) | TypeScript JSX | 18 | 4 | 3 | 25 |
| [frontend/src/components/feedback/LoadingState.tsx](/frontend/src/components/feedback/LoadingState.tsx) | TypeScript JSX | 13 | 0 | 2 | 15 |
| [frontend/src/components/layout/AdminLayout.css](/frontend/src/components/layout/AdminLayout.css) | PostCSS | 17 | 0 | 4 | 21 |
| [frontend/src/components/layout/AdminLayout.tsx](/frontend/src/components/layout/AdminLayout.tsx) | TypeScript JSX | 17 | 4 | 2 | 23 |
| [frontend/src/components/layout/Breadcrumbs.tsx](/frontend/src/components/layout/Breadcrumbs.tsx) | TypeScript JSX | 72 | 5 | 7 | 84 |
| [frontend/src/components/layout/Header.css](/frontend/src/components/layout/Header.css) | PostCSS | 109 | 0 | 15 | 124 |
| [frontend/src/components/layout/Header.tsx](/frontend/src/components/layout/Header.tsx) | TypeScript JSX | 66 | 6 | 8 | 80 |
| [frontend/src/components/layout/PageHeader.tsx](/frontend/src/components/layout/PageHeader.tsx) | TypeScript JSX | 34 | 5 | 3 | 42 |
| [frontend/src/components/layout/PublicFooter.tsx](/frontend/src/components/layout/PublicFooter.tsx) | TypeScript JSX | 158 | 6 | 8 | 172 |
| [frontend/src/components/layout/PublicLayout.tsx](/frontend/src/components/layout/PublicLayout.tsx) | TypeScript JSX | 14 | 5 | 2 | 21 |
| [frontend/src/components/layout/PublicNavbar.css](/frontend/src/components/layout/PublicNavbar.css) | PostCSS | 99 | 8 | 18 | 125 |
| [frontend/src/components/layout/PublicNavbar.tsx](/frontend/src/components/layout/PublicNavbar.tsx) | TypeScript JSX | 247 | 10 | 21 | 278 |
| [frontend/src/components/layout/Sidebar.css](/frontend/src/components/layout/Sidebar.css) | PostCSS | 126 | 1 | 18 | 145 |
| [frontend/src/components/layout/Sidebar.tsx](/frontend/src/components/layout/Sidebar.tsx) | TypeScript JSX | 68 | 5 | 9 | 82 |
| [frontend/src/components/layout/breadcrumbsCons.ts](/frontend/src/components/layout/breadcrumbsCons.ts) | TypeScript | 27 | 5 | 10 | 42 |
| [frontend/src/components/layout/navegacionAdmin.ts](/frontend/src/components/layout/navegacionAdmin.ts) | TypeScript | 68 | 3 | 3 | 74 |
| [frontend/src/components/ui/AyudaTooltip.tsx](/frontend/src/components/ui/AyudaTooltip.tsx) | TypeScript JSX | 21 | 11 | 2 | 34 |
| [frontend/src/components/ui/Button.tsx](/frontend/src/components/ui/Button.tsx) | TypeScript JSX | 88 | 10 | 8 | 106 |
| [frontend/src/components/ui/DataTable.css](/frontend/src/components/ui/DataTable.css) | PostCSS | 62 | 3 | 10 | 75 |
| [frontend/src/components/ui/DataTable.tsx](/frontend/src/components/ui/DataTable.tsx) | TypeScript JSX | 109 | 15 | 7 | 131 |
| [frontend/src/components/ui/FiltersBar.tsx](/frontend/src/components/ui/FiltersBar.tsx) | TypeScript JSX | 95 | 13 | 7 | 115 |
| [frontend/src/components/ui/FormSection.tsx](/frontend/src/components/ui/FormSection.tsx) | TypeScript JSX | 27 | 18 | 3 | 48 |
| [frontend/src/components/ui/KpiCard.tsx](/frontend/src/components/ui/KpiCard.tsx) | TypeScript JSX | 144 | 17 | 14 | 175 |
| [frontend/src/components/ui/Pagination.tsx](/frontend/src/components/ui/Pagination.tsx) | TypeScript JSX | 99 | 7 | 10 | 116 |
| [frontend/src/components/ui/PasswordInput.tsx](/frontend/src/components/ui/PasswordInput.tsx) | TypeScript JSX | 35 | 7 | 4 | 46 |
| [frontend/src/components/ui/StatusBadge.css](/frontend/src/components/ui/StatusBadge.css) | PostCSS | 38 | 0 | 6 | 44 |
| [frontend/src/components/ui/StatusBadge.tsx](/frontend/src/components/ui/StatusBadge.tsx) | TypeScript JSX | 93 | 20 | 8 | 121 |
| [frontend/src/components/ui/Tabs.css](/frontend/src/components/ui/Tabs.css) | PostCSS | 43 | 0 | 6 | 49 |
| [frontend/src/components/ui/Tabs.tsx](/frontend/src/components/ui/Tabs.tsx) | TypeScript JSX | 42 | 8 | 4 | 54 |
| [frontend/src/features/auth/components/CaptchaCanvas.tsx](/frontend/src/features/auth/components/CaptchaCanvas.tsx) | TypeScript JSX | 95 | 12 | 15 | 122 |
| [frontend/src/features/auth/components/CronometroBloqueo.tsx](/frontend/src/features/auth/components/CronometroBloqueo.tsx) | TypeScript JSX | 34 | 5 | 6 | 45 |
| [frontend/src/features/auth/components/DeclaratoriaModal.tsx](/frontend/src/features/auth/components/DeclaratoriaModal.tsx) | TypeScript JSX | 59 | 4 | 8 | 71 |
| [frontend/src/features/auth/components/IdiomaSelector.tsx](/frontend/src/features/auth/components/IdiomaSelector.tsx) | TypeScript JSX | 35 | 4 | 3 | 42 |
| [frontend/src/features/auth/components/IntentosRestantes.tsx](/frontend/src/features/auth/components/IntentosRestantes.tsx) | TypeScript JSX | 17 | 4 | 3 | 24 |
| [frontend/src/features/auth/components/LoginForm.tsx](/frontend/src/features/auth/components/LoginForm.tsx) | TypeScript JSX | 240 | 16 | 21 | 277 |
| [frontend/src/features/auth/components/RecaptchaWrapper.tsx](/frontend/src/features/auth/components/RecaptchaWrapper.tsx) | TypeScript JSX | 18 | 11 | 3 | 32 |
| [frontend/src/features/auth/components/Verificacion2FA.tsx](/frontend/src/features/auth/components/Verificacion2FA.tsx) | TypeScript JSX | 93 | 6 | 11 | 110 |
| [frontend/src/features/auth/hooks/useExpiracionSesion.ts](/frontend/src/features/auth/hooks/useExpiracionSesion.ts) | TypeScript | 29 | 5 | 5 | 39 |
| [frontend/src/features/auth/hooks/useLogin.ts](/frontend/src/features/auth/hooks/useLogin.ts) | TypeScript | 33 | 11 | 5 | 49 |
| [frontend/src/features/auth/hooks/useRecuperacion.ts](/frontend/src/features/auth/hooks/useRecuperacion.ts) | TypeScript | 24 | 2 | 4 | 30 |
| [frontend/src/features/auth/hooks/useRegistro.ts](/frontend/src/features/auth/hooks/useRegistro.ts) | TypeScript | 15 | 0 | 3 | 18 |
| [frontend/src/features/auth/pages/LoginPage.tsx](/frontend/src/features/auth/pages/LoginPage.tsx) | TypeScript JSX | 99 | 4 | 7 | 110 |
| [frontend/src/features/auth/pages/RegistroPage.tsx](/frontend/src/features/auth/pages/RegistroPage.tsx) | TypeScript JSX | 254 | 8 | 21 | 283 |
| [frontend/src/features/auth/pages/RestablecerContrasenaPage.tsx](/frontend/src/features/auth/pages/RestablecerContrasenaPage.tsx) | TypeScript JSX | 119 | 1 | 13 | 133 |
| [frontend/src/features/auth/pages/SolicitarRecuperacionPage.tsx](/frontend/src/features/auth/pages/SolicitarRecuperacionPage.tsx) | TypeScript JSX | 92 | 5 | 11 | 108 |
| [frontend/src/features/auth/react-google-recaptcha.d.ts](/frontend/src/features/auth/react-google-recaptcha.d.ts) | TypeScript | 24 | 0 | 2 | 26 |
| [frontend/src/features/auth/schemas/login.schema.ts](/frontend/src/features/auth/schemas/login.schema.ts) | TypeScript | 12 | 7 | 2 | 21 |
| [frontend/src/features/auth/schemas/registro.schema.ts](/frontend/src/features/auth/schemas/registro.schema.ts) | TypeScript | 20 | 0 | 3 | 23 |
| [frontend/src/features/auth/schemas/restablecerContrasena.schema.ts](/frontend/src/features/auth/schemas/restablecerContrasena.schema.ts) | TypeScript | 13 | 0 | 3 | 16 |
| [frontend/src/features/auth/schemas/solicitarRecuperacion.schema.ts](/frontend/src/features/auth/schemas/solicitarRecuperacion.schema.ts) | TypeScript | 5 | 0 | 3 | 8 |
| [frontend/src/features/auth/schemas/verificacion2FA.schema.ts](/frontend/src/features/auth/schemas/verificacion2FA.schema.ts) | TypeScript | 8 | 4 | 2 | 14 |
| [frontend/src/features/auth/store/useAuthPrefsStore.ts](/frontend/src/features/auth/store/useAuthPrefsStore.ts) | TypeScript | 24 | 7 | 2 | 33 |
| [frontend/src/features/auth/store/useAuthStore.ts](/frontend/src/features/auth/store/useAuthStore.ts) | TypeScript | 29 | 11 | 5 | 45 |
| [frontend/src/features/auth/types.ts](/frontend/src/features/auth/types.ts) | TypeScript | 10 | 12 | 3 | 25 |
| [frontend/src/features/carrito/components/CarritoItemList.tsx](/frontend/src/features/carrito/components/CarritoItemList.tsx) | TypeScript JSX | 102 | 7 | 7 | 116 |
| [frontend/src/features/carrito/components/CarritoResumen.tsx](/frontend/src/features/carrito/components/CarritoResumen.tsx) | TypeScript JSX | 91 | 5 | 9 | 105 |
| [frontend/src/features/carrito/components/CuponDescuento.tsx](/frontend/src/features/carrito/components/CuponDescuento.tsx) | TypeScript JSX | 43 | 3 | 5 | 51 |
| [frontend/src/features/carrito/components/EnvioGratisBar.tsx](/frontend/src/features/carrito/components/EnvioGratisBar.tsx) | TypeScript JSX | 43 | 3 | 4 | 50 |
| [frontend/src/features/carrito/hooks/useConfirmarPedido.ts](/frontend/src/features/carrito/hooks/useConfirmarPedido.ts) | TypeScript | 43 | 5 | 4 | 52 |
| [frontend/src/features/carrito/pages/CarritoPage.tsx](/frontend/src/features/carrito/pages/CarritoPage.tsx) | TypeScript JSX | 111 | 8 | 10 | 129 |
| [frontend/src/features/carrito/pages/CheckoutPage.tsx](/frontend/src/features/carrito/pages/CheckoutPage.tsx) | TypeScript JSX | 446 | 10 | 31 | 487 |
| [frontend/src/features/carrito/schemas/checkout.schema.ts](/frontend/src/features/carrito/schemas/checkout.schema.ts) | TypeScript | 25 | 4 | 7 | 36 |
| [frontend/src/features/carrito/store/carritoStore.ts](/frontend/src/features/carrito/store/carritoStore.ts) | TypeScript | 53 | 17 | 9 | 79 |
| [frontend/src/features/carrito/types.ts](/frontend/src/features/carrito/types.ts) | TypeScript | 1 | 4 | 1 | 6 |
| [frontend/src/features/catalogo/components/CategoriaForm.tsx](/frontend/src/features/catalogo/components/CategoriaForm.tsx) | TypeScript JSX | 160 | 1 | 14 | 175 |
| [frontend/src/features/catalogo/components/CategoriaTable.tsx](/frontend/src/features/catalogo/components/CategoriaTable.tsx) | TypeScript JSX | 68 | 0 | 5 | 73 |
| [frontend/src/features/catalogo/components/CategoriasTab.tsx](/frontend/src/features/catalogo/components/CategoriasTab.tsx) | TypeScript JSX | 110 | 4 | 11 | 125 |
| [frontend/src/features/catalogo/components/ProductoFilters.tsx](/frontend/src/features/catalogo/components/ProductoFilters.tsx) | TypeScript JSX | 53 | 0 | 4 | 57 |
| [frontend/src/features/catalogo/components/ProductoForm.tsx](/frontend/src/features/catalogo/components/ProductoForm.tsx) | TypeScript JSX | 365 | 5 | 20 | 390 |
| [frontend/src/features/catalogo/components/ProductoModal.tsx](/frontend/src/features/catalogo/components/ProductoModal.tsx) | TypeScript JSX | 29 | 4 | 3 | 36 |
| [frontend/src/features/catalogo/components/ProductoTable.tsx](/frontend/src/features/catalogo/components/ProductoTable.tsx) | TypeScript JSX | 85 | 0 | 5 | 90 |
| [frontend/src/features/catalogo/components/ProductosTab.tsx](/frontend/src/features/catalogo/components/ProductosTab.tsx) | TypeScript JSX | 106 | 5 | 11 | 122 |
| [frontend/src/features/catalogo/components/VarianteForm.tsx](/frontend/src/features/catalogo/components/VarianteForm.tsx) | TypeScript JSX | 229 | 2 | 16 | 247 |
| [frontend/src/features/catalogo/components/VarianteTable.tsx](/frontend/src/features/catalogo/components/VarianteTable.tsx) | TypeScript JSX | 71 | 0 | 5 | 76 |
| [frontend/src/features/catalogo/hooks/useCategorias.ts](/frontend/src/features/catalogo/hooks/useCategorias.ts) | TypeScript | 61 | 0 | 6 | 67 |
| [frontend/src/features/catalogo/hooks/useProductos.ts](/frontend/src/features/catalogo/hooks/useProductos.ts) | TypeScript | 62 | 0 | 6 | 68 |
| [frontend/src/features/catalogo/hooks/useVariantes.ts](/frontend/src/features/catalogo/hooks/useVariantes.ts) | TypeScript | 44 | 2 | 4 | 50 |
| [frontend/src/features/catalogo/pages/CategoriasPage.tsx](/frontend/src/features/catalogo/pages/CategoriasPage.tsx) | TypeScript JSX | 4 | 4 | 2 | 10 |
| [frontend/src/features/catalogo/pages/ProductoFormPage.tsx](/frontend/src/features/catalogo/pages/ProductoFormPage.tsx) | TypeScript JSX | 50 | 0 | 7 | 57 |
| [frontend/src/features/catalogo/pages/ProductoVariantesPage.tsx](/frontend/src/features/catalogo/pages/ProductoVariantesPage.tsx) | TypeScript JSX | 139 | 1 | 17 | 157 |
| [frontend/src/features/catalogo/pages/ProductosPage.tsx](/frontend/src/features/catalogo/pages/ProductosPage.tsx) | TypeScript JSX | 36 | 6 | 7 | 49 |
| [frontend/src/features/catalogo/schemas/categoria.schema.ts](/frontend/src/features/catalogo/schemas/categoria.schema.ts) | TypeScript | 12 | 0 | 3 | 15 |
| [frontend/src/features/catalogo/schemas/producto.schema.ts](/frontend/src/features/catalogo/schemas/producto.schema.ts) | TypeScript | 24 | 0 | 3 | 27 |
| [frontend/src/features/catalogo/schemas/variante.schema.ts](/frontend/src/features/catalogo/schemas/variante.schema.ts) | TypeScript | 18 | 1 | 3 | 22 |
| [frontend/src/features/catalogo/types.ts](/frontend/src/features/catalogo/types.ts) | TypeScript | 38 | 8 | 6 | 52 |
| [frontend/src/features/clientes/components/ArcoTab.tsx](/frontend/src/features/clientes/components/ArcoTab.tsx) | TypeScript JSX | 26 | 1 | 5 | 32 |
| [frontend/src/features/clientes/components/AtenderArcoModal.tsx](/frontend/src/features/clientes/components/AtenderArcoModal.tsx) | TypeScript JSX | 141 | 0 | 13 | 154 |
| [frontend/src/features/clientes/components/ClienteDetalleModal.tsx](/frontend/src/features/clientes/components/ClienteDetalleModal.tsx) | TypeScript JSX | 176 | 4 | 7 | 187 |
| [frontend/src/features/clientes/components/ClientesResumenCards.tsx](/frontend/src/features/clientes/components/ClientesResumenCards.tsx) | TypeScript JSX | 65 | 4 | 6 | 75 |
| [frontend/src/features/clientes/components/ClientesTable.tsx](/frontend/src/features/clientes/components/ClientesTable.tsx) | TypeScript JSX | 147 | 0 | 6 | 153 |
| [frontend/src/features/clientes/components/ComprasTab.tsx](/frontend/src/features/clientes/components/ComprasTab.tsx) | TypeScript JSX | 106 | 1 | 9 | 116 |
| [frontend/src/features/clientes/components/DireccionModal.tsx](/frontend/src/features/clientes/components/DireccionModal.tsx) | TypeScript JSX | 184 | 0 | 13 | 197 |
| [frontend/src/features/clientes/components/DireccionesTab.tsx](/frontend/src/features/clientes/components/DireccionesTab.tsx) | TypeScript JSX | 90 | 1 | 9 | 100 |
| [frontend/src/features/clientes/components/DirectorioTab.tsx](/frontend/src/features/clientes/components/DirectorioTab.tsx) | TypeScript JSX | 96 | 1 | 10 | 107 |
| [frontend/src/features/clientes/components/PerfilTab.tsx](/frontend/src/features/clientes/components/PerfilTab.tsx) | TypeScript JSX | 83 | 1 | 14 | 98 |
| [frontend/src/features/clientes/components/PrivacidadTab.tsx](/frontend/src/features/clientes/components/PrivacidadTab.tsx) | TypeScript JSX | 147 | 1 | 15 | 163 |
| [frontend/src/features/clientes/components/RfmTab.tsx](/frontend/src/features/clientes/components/RfmTab.tsx) | TypeScript JSX | 190 | 8 | 13 | 211 |
| [frontend/src/features/clientes/components/SolicitudesArcoTable.tsx](/frontend/src/features/clientes/components/SolicitudesArcoTable.tsx) | TypeScript JSX | 82 | 0 | 6 | 88 |
| [frontend/src/features/clientes/hooks/useClientes.ts](/frontend/src/features/clientes/hooks/useClientes.ts) | TypeScript | 229 | 6 | 17 | 252 |
| [frontend/src/features/clientes/pages/ClientesPage.tsx](/frontend/src/features/clientes/pages/ClientesPage.tsx) | TypeScript JSX | 47 | 0 | 8 | 55 |
| [frontend/src/features/clientes/pages/MiCuentaPage.tsx](/frontend/src/features/clientes/pages/MiCuentaPage.tsx) | TypeScript JSX | 69 | 5 | 7 | 81 |
| [frontend/src/features/clientes/schemas/arco.schema.ts](/frontend/src/features/clientes/schemas/arco.schema.ts) | TypeScript | 17 | 0 | 4 | 21 |
| [frontend/src/features/clientes/schemas/cliente.schema.ts](/frontend/src/features/clientes/schemas/cliente.schema.ts) | TypeScript | 24 | 0 | 3 | 27 |
| [frontend/src/features/clientes/schemas/direccion.schema.ts](/frontend/src/features/clientes/schemas/direccion.schema.ts) | TypeScript | 17 | 0 | 3 | 20 |
| [frontend/src/features/clientes/types.ts](/frontend/src/features/clientes/types.ts) | TypeScript | 80 | 6 | 12 | 98 |
| [frontend/src/features/compras/components/ComprasResumenCards.tsx](/frontend/src/features/compras/components/ComprasResumenCards.tsx) | TypeScript JSX | 39 | 4 | 4 | 47 |
| [frontend/src/features/compras/components/DevolucionProveedorModal.tsx](/frontend/src/features/compras/components/DevolucionProveedorModal.tsx) | TypeScript JSX | 253 | 2 | 21 | 276 |
| [frontend/src/features/compras/components/HistorialProveedorModal.tsx](/frontend/src/features/compras/components/HistorialProveedorModal.tsx) | TypeScript JSX | 107 | 5 | 9 | 121 |
| [frontend/src/features/compras/components/NuevaOrdenCompraModal.tsx](/frontend/src/features/compras/components/NuevaOrdenCompraModal.tsx) | TypeScript JSX | 30 | 4 | 3 | 37 |
| [frontend/src/features/compras/components/OrdenCompraForm.tsx](/frontend/src/features/compras/components/OrdenCompraForm.tsx) | TypeScript JSX | 607 | 8 | 48 | 663 |
| [frontend/src/features/compras/components/OrdenesTab.tsx](/frontend/src/features/compras/components/OrdenesTab.tsx) | TypeScript JSX | 114 | 1 | 12 | 127 |
| [frontend/src/features/compras/components/OrdenesTable.tsx](/frontend/src/features/compras/components/OrdenesTable.tsx) | TypeScript JSX | 152 | 0 | 5 | 157 |
| [frontend/src/features/compras/components/ProveedorModal.tsx](/frontend/src/features/compras/components/ProveedorModal.tsx) | TypeScript JSX | 266 | 2 | 19 | 287 |
| [frontend/src/features/compras/components/ProveedoresTab.tsx](/frontend/src/features/compras/components/ProveedoresTab.tsx) | TypeScript JSX | 118 | 1 | 12 | 131 |
| [frontend/src/features/compras/components/ProveedoresTable.tsx](/frontend/src/features/compras/components/ProveedoresTable.tsx) | TypeScript JSX | 112 | 0 | 5 | 117 |
| [frontend/src/features/compras/components/RecepcionModal.tsx](/frontend/src/features/compras/components/RecepcionModal.tsx) | TypeScript JSX | 312 | 5 | 24 | 341 |
| [frontend/src/features/compras/components/ReportesComprasTab.tsx](/frontend/src/features/compras/components/ReportesComprasTab.tsx) | TypeScript JSX | 175 | 1 | 8 | 184 |
| [frontend/src/features/compras/hooks/useCompras.ts](/frontend/src/features/compras/hooks/useCompras.ts) | TypeScript | 294 | 9 | 24 | 327 |
| [frontend/src/features/compras/pages/ComprasPage.tsx](/frontend/src/features/compras/pages/ComprasPage.tsx) | TypeScript JSX | 37 | 0 | 6 | 43 |
| [frontend/src/features/compras/pages/OrdenCompraDetallePage.tsx](/frontend/src/features/compras/pages/OrdenCompraDetallePage.tsx) | TypeScript JSX | 369 | 7 | 28 | 404 |
| [frontend/src/features/compras/pages/OrdenCompraFormPage.tsx](/frontend/src/features/compras/pages/OrdenCompraFormPage.tsx) | TypeScript JSX | 75 | 0 | 9 | 84 |
| [frontend/src/features/compras/schemas/devolucion.schema.ts](/frontend/src/features/compras/schemas/devolucion.schema.ts) | TypeScript | 11 | 0 | 3 | 14 |
| [frontend/src/features/compras/schemas/ordenCompra.schema.ts](/frontend/src/features/compras/schemas/ordenCompra.schema.ts) | TypeScript | 16 | 0 | 4 | 20 |
| [frontend/src/features/compras/schemas/proveedor.schema.ts](/frontend/src/features/compras/schemas/proveedor.schema.ts) | TypeScript | 32 | 0 | 3 | 35 |
| [frontend/src/features/compras/schemas/recepcion.schema.ts](/frontend/src/features/compras/schemas/recepcion.schema.ts) | TypeScript | 17 | 0 | 4 | 21 |
| [frontend/src/features/compras/types.ts](/frontend/src/features/compras/types.ts) | TypeScript | 126 | 4 | 16 | 146 |
| [frontend/src/features/configuracion/components/ComercialForm.tsx](/frontend/src/features/configuracion/components/ComercialForm.tsx) | TypeScript JSX | 166 | 2 | 14 | 182 |
| [frontend/src/features/configuracion/components/EmpresaForm.tsx](/frontend/src/features/configuracion/components/EmpresaForm.tsx) | TypeScript JSX | 305 | 3 | 22 | 330 |
| [frontend/src/features/configuracion/components/HistorialCambiosTable.tsx](/frontend/src/features/configuracion/components/HistorialCambiosTable.tsx) | TypeScript JSX | 113 | 0 | 6 | 119 |
| [frontend/src/features/configuracion/components/OperativoForm.tsx](/frontend/src/features/configuracion/components/OperativoForm.tsx) | TypeScript JSX | 165 | 2 | 13 | 180 |
| [frontend/src/features/configuracion/components/SeguridadForm.tsx](/frontend/src/features/configuracion/components/SeguridadForm.tsx) | TypeScript JSX | 168 | 2 | 13 | 183 |
| [frontend/src/features/configuracion/components/TiendaForm.tsx](/frontend/src/features/configuracion/components/TiendaForm.tsx) | TypeScript JSX | 203 | 3 | 15 | 221 |
| [frontend/src/features/configuracion/hooks/useConfiguracion.ts](/frontend/src/features/configuracion/hooks/useConfiguracion.ts) | TypeScript | 101 | 3 | 8 | 112 |
| [frontend/src/features/configuracion/pages/ConfiguracionPage.tsx](/frontend/src/features/configuracion/pages/ConfiguracionPage.tsx) | TypeScript JSX | 57 | 0 | 8 | 65 |
| [frontend/src/features/configuracion/schemas/configuracion.schema.ts](/frontend/src/features/configuracion/schemas/configuracion.schema.ts) | TypeScript | 90 | 0 | 7 | 97 |
| [frontend/src/features/configuracion/types.ts](/frontend/src/features/configuracion/types.ts) | TypeScript | 52 | 0 | 7 | 59 |
| [frontend/src/features/dashboard/pages/DashboardPage.tsx](/frontend/src/features/dashboard/pages/DashboardPage.tsx) | TypeScript JSX | 9 | 0 | 2 | 11 |
| [frontend/src/features/i18n/index.ts](/frontend/src/features/i18n/index.ts) | TypeScript | 105 | 0 | 5 | 110 |
| [frontend/src/features/inventario/components/AjusteStockForm.tsx](/frontend/src/features/inventario/components/AjusteStockForm.tsx) | TypeScript JSX | 205 | 2 | 16 | 223 |
| [frontend/src/features/inventario/components/AlertasPanel.tsx](/frontend/src/features/inventario/components/AlertasPanel.tsx) | TypeScript JSX | 73 | 0 | 4 | 77 |
| [frontend/src/features/inventario/components/AlertasTab.tsx](/frontend/src/features/inventario/components/AlertasTab.tsx) | TypeScript JSX | 44 | 5 | 6 | 55 |
| [frontend/src/features/inventario/components/InventarioResumenCards.tsx](/frontend/src/features/inventario/components/InventarioResumenCards.tsx) | TypeScript JSX | 61 | 6 | 6 | 73 |
| [frontend/src/features/inventario/components/KardexFilters.tsx](/frontend/src/features/inventario/components/KardexFilters.tsx) | TypeScript JSX | 62 | 0 | 4 | 66 |
| [frontend/src/features/inventario/components/KardexTable.tsx](/frontend/src/features/inventario/components/KardexTable.tsx) | TypeScript JSX | 84 | 6 | 4 | 94 |
| [frontend/src/features/inventario/components/ReportesTab.tsx](/frontend/src/features/inventario/components/ReportesTab.tsx) | TypeScript JSX | 88 | 1 | 4 | 93 |
| [frontend/src/features/inventario/components/StockFilters.tsx](/frontend/src/features/inventario/components/StockFilters.tsx) | TypeScript JSX | 31 | 0 | 4 | 35 |
| [frontend/src/features/inventario/components/StockTab.tsx](/frontend/src/features/inventario/components/StockTab.tsx) | TypeScript JSX | 67 | 4 | 9 | 80 |
| [frontend/src/features/inventario/components/StockTable.tsx](/frontend/src/features/inventario/components/StockTable.tsx) | TypeScript JSX | 115 | 0 | 6 | 121 |
| [frontend/src/features/inventario/components/UmbralAlertaModal.tsx](/frontend/src/features/inventario/components/UmbralAlertaModal.tsx) | TypeScript JSX | 133 | 2 | 11 | 146 |
| [frontend/src/features/inventario/hooks/useInventario.ts](/frontend/src/features/inventario/hooks/useInventario.ts) | TypeScript | 111 | 5 | 11 | 127 |
| [frontend/src/features/inventario/pages/InventarioPage.tsx](/frontend/src/features/inventario/pages/InventarioPage.tsx) | TypeScript JSX | 45 | 6 | 7 | 58 |
| [frontend/src/features/inventario/pages/KardexPage.tsx](/frontend/src/features/inventario/pages/KardexPage.tsx) | TypeScript JSX | 281 | 9 | 18 | 308 |
| [frontend/src/features/inventario/schemas/ajusteStock.schema.ts](/frontend/src/features/inventario/schemas/ajusteStock.schema.ts) | TypeScript | 16 | 0 | 3 | 19 |
| [frontend/src/features/inventario/schemas/umbralAlerta.schema.ts](/frontend/src/features/inventario/schemas/umbralAlerta.schema.ts) | TypeScript | 9 | 0 | 3 | 12 |
| [frontend/src/features/inventario/types.ts](/frontend/src/features/inventario/types.ts) | TypeScript | 75 | 5 | 10 | 90 |
| [frontend/src/features/tienda/components/AccionesCompra.tsx](/frontend/src/features/tienda/components/AccionesCompra.tsx) | TypeScript JSX | 74 | 6 | 6 | 86 |
| [frontend/src/features/tienda/components/BeneficiosSection.tsx](/frontend/src/features/tienda/components/BeneficiosSection.tsx) | TypeScript JSX | 55 | 3 | 2 | 60 |
| [frontend/src/features/tienda/components/BuscadorSeguimiento.tsx](/frontend/src/features/tienda/components/BuscadorSeguimiento.tsx) | TypeScript JSX | 48 | 3 | 4 | 55 |
| [frontend/src/features/tienda/components/CategoriasDestacadasSection.tsx](/frontend/src/features/tienda/components/CategoriasDestacadasSection.tsx) | TypeScript JSX | 74 | 4 | 5 | 83 |
| [frontend/src/features/tienda/components/FiltrosTienda.tsx](/frontend/src/features/tienda/components/FiltrosTienda.tsx) | TypeScript JSX | 71 | 5 | 4 | 80 |
| [frontend/src/features/tienda/components/GaleriaProducto.tsx](/frontend/src/features/tienda/components/GaleriaProducto.tsx) | TypeScript JSX | 49 | 5 | 5 | 59 |
| [frontend/src/features/tienda/components/GrillaProductos.tsx](/frontend/src/features/tienda/components/GrillaProductos.tsx) | TypeScript JSX | 76 | 3 | 6 | 85 |
| [frontend/src/features/tienda/components/HeroSection.tsx](/frontend/src/features/tienda/components/HeroSection.tsx) | TypeScript JSX | 110 | 7 | 8 | 125 |
| [frontend/src/features/tienda/components/MisPedidosLista.tsx](/frontend/src/features/tienda/components/MisPedidosLista.tsx) | TypeScript JSX | 64 | 3 | 4 | 71 |
| [frontend/src/features/tienda/components/ModalConfirmacionAgregado.tsx](/frontend/src/features/tienda/components/ModalConfirmacionAgregado.tsx) | TypeScript JSX | 90 | 3 | 7 | 100 |
| [frontend/src/features/tienda/components/ModalSeleccionRapida.tsx](/frontend/src/features/tienda/components/ModalSeleccionRapida.tsx) | TypeScript JSX | 237 | 8 | 19 | 264 |
| [frontend/src/features/tienda/components/NovedadesSection.tsx](/frontend/src/features/tienda/components/NovedadesSection.tsx) | TypeScript JSX | 68 | 7 | 6 | 81 |
| [frontend/src/features/tienda/components/OrdenamientoSelector.tsx](/frontend/src/features/tienda/components/OrdenamientoSelector.tsx) | TypeScript JSX | 82 | 5 | 6 | 93 |
| [frontend/src/features/tienda/components/PanelInspeccionStaff.tsx](/frontend/src/features/tienda/components/PanelInspeccionStaff.tsx) | TypeScript JSX | 122 | 4 | 6 | 132 |
| [frontend/src/features/tienda/components/PedidoDetalleModal.tsx](/frontend/src/features/tienda/components/PedidoDetalleModal.tsx) | TypeScript JSX | 206 | 5 | 13 | 224 |
| [frontend/src/features/tienda/components/PedidosAdminFilters.tsx](/frontend/src/features/tienda/components/PedidosAdminFilters.tsx) | TypeScript JSX | 83 | 3 | 7 | 93 |
| [frontend/src/features/tienda/components/PedidosAdminStats.tsx](/frontend/src/features/tienda/components/PedidosAdminStats.tsx) | TypeScript JSX | 35 | 4 | 4 | 43 |
| [frontend/src/features/tienda/components/ProductoCardPublico.tsx](/frontend/src/features/tienda/components/ProductoCardPublico.tsx) | TypeScript JSX | 114 | 7 | 8 | 129 |
| [frontend/src/features/tienda/components/SelectorVariante.tsx](/frontend/src/features/tienda/components/SelectorVariante.tsx) | TypeScript JSX | 89 | 6 | 4 | 99 |
| [frontend/src/features/tienda/components/TimelineSeguimiento.tsx](/frontend/src/features/tienda/components/TimelineSeguimiento.tsx) | TypeScript JSX | 186 | 7 | 10 | 203 |
| [frontend/src/features/tienda/hooks/usePedidos.ts](/frontend/src/features/tienda/hooks/usePedidos.ts) | TypeScript | 77 | 5 | 8 | 90 |
| [frontend/src/features/tienda/hooks/useTiendaCatalogo.ts](/frontend/src/features/tienda/hooks/useTiendaCatalogo.ts) | TypeScript | 72 | 19 | 7 | 98 |
| [frontend/src/features/tienda/pages/ColeccionesPage.tsx](/frontend/src/features/tienda/pages/ColeccionesPage.tsx) | TypeScript JSX | 161 | 10 | 19 | 190 |
| [frontend/src/features/tienda/pages/ContactoPage.tsx](/frontend/src/features/tienda/pages/ContactoPage.tsx) | TypeScript JSX | 77 | 6 | 7 | 90 |
| [frontend/src/features/tienda/pages/HomePage.tsx](/frontend/src/features/tienda/pages/HomePage.tsx) | TypeScript JSX | 50 | 9 | 10 | 69 |
| [frontend/src/features/tienda/pages/NosotrosPage.tsx](/frontend/src/features/tienda/pages/NosotrosPage.tsx) | TypeScript JSX | 43 | 1 | 8 | 52 |
| [frontend/src/features/tienda/pages/PedidosAdminPage.tsx](/frontend/src/features/tienda/pages/PedidosAdminPage.tsx) | TypeScript JSX | 197 | 6 | 15 | 218 |
| [frontend/src/features/tienda/pages/ProductoDetallePage.tsx](/frontend/src/features/tienda/pages/ProductoDetallePage.tsx) | TypeScript JSX | 228 | 13 | 27 | 268 |
| [frontend/src/features/tienda/pages/SeguimientoPedidoPage.tsx](/frontend/src/features/tienda/pages/SeguimientoPedidoPage.tsx) | TypeScript JSX | 88 | 9 | 12 | 109 |
| [frontend/src/features/tienda/types.ts](/frontend/src/features/tienda/types.ts) | TypeScript | 73 | 10 | 10 | 93 |
| [frontend/src/features/usuarios/components/EventosSeguridadTable.tsx](/frontend/src/features/usuarios/components/EventosSeguridadTable.tsx) | TypeScript JSX | 68 | 0 | 5 | 73 |
| [frontend/src/features/usuarios/components/RolesMatrizPermisos.tsx](/frontend/src/features/usuarios/components/RolesMatrizPermisos.tsx) | TypeScript JSX | 171 | 3 | 17 | 191 |
| [frontend/src/features/usuarios/components/SeguridadResumenCards.tsx](/frontend/src/features/usuarios/components/SeguridadResumenCards.tsx) | TypeScript JSX | 60 | 5 | 6 | 71 |
| [frontend/src/features/usuarios/components/SesionesActivasTable.tsx](/frontend/src/features/usuarios/components/SesionesActivasTable.tsx) | TypeScript JSX | 77 | 0 | 5 | 82 |
| [frontend/src/features/usuarios/components/SesionesAuditoriaTab.tsx](/frontend/src/features/usuarios/components/SesionesAuditoriaTab.tsx) | TypeScript JSX | 84 | 1 | 11 | 96 |
| [frontend/src/features/usuarios/components/UsuarioModal.tsx](/frontend/src/features/usuarios/components/UsuarioModal.tsx) | TypeScript JSX | 175 | 0 | 13 | 188 |
| [frontend/src/features/usuarios/components/UsuariosTab.tsx](/frontend/src/features/usuarios/components/UsuariosTab.tsx) | TypeScript JSX | 135 | 1 | 14 | 150 |
| [frontend/src/features/usuarios/components/UsuariosTable.tsx](/frontend/src/features/usuarios/components/UsuariosTable.tsx) | TypeScript JSX | 124 | 0 | 6 | 130 |
| [frontend/src/features/usuarios/hooks/useUsuarios.ts](/frontend/src/features/usuarios/hooks/useUsuarios.ts) | TypeScript | 183 | 4 | 15 | 202 |
| [frontend/src/features/usuarios/pages/UsuariosSistemaPage.tsx](/frontend/src/features/usuarios/pages/UsuariosSistemaPage.tsx) | TypeScript JSX | 56 | 0 | 8 | 64 |
| [frontend/src/features/usuarios/schemas/rol.schema.ts](/frontend/src/features/usuarios/schemas/rol.schema.ts) | TypeScript | 13 | 0 | 3 | 16 |
| [frontend/src/features/usuarios/schemas/usuario.schema.ts](/frontend/src/features/usuarios/schemas/usuario.schema.ts) | TypeScript | 23 | 0 | 3 | 26 |
| [frontend/src/features/usuarios/types.ts](/frontend/src/features/usuarios/types.ts) | TypeScript | 67 | 0 | 10 | 77 |
| [frontend/src/features/ventas/components/ReportesVentasTab.tsx](/frontend/src/features/ventas/components/ReportesVentasTab.tsx) | TypeScript JSX | 107 | 5 | 6 | 118 |
| [frontend/src/features/ventas/components/VentaDetalleCard.tsx](/frontend/src/features/ventas/components/VentaDetalleCard.tsx) | TypeScript JSX | 341 | 10 | 17 | 368 |
| [frontend/src/features/ventas/components/VentaForm.tsx](/frontend/src/features/ventas/components/VentaForm.tsx) | TypeScript JSX | 435 | 7 | 23 | 465 |
| [frontend/src/features/ventas/components/VentasFilters.tsx](/frontend/src/features/ventas/components/VentasFilters.tsx) | TypeScript JSX | 71 | 0 | 4 | 75 |
| [frontend/src/features/ventas/components/VentasListadoTab.tsx](/frontend/src/features/ventas/components/VentasListadoTab.tsx) | TypeScript JSX | 120 | 2 | 12 | 134 |
| [frontend/src/features/ventas/components/VentasResumenCards.tsx](/frontend/src/features/ventas/components/VentasResumenCards.tsx) | TypeScript JSX | 45 | 4 | 5 | 54 |
| [frontend/src/features/ventas/components/VentasTable.tsx](/frontend/src/features/ventas/components/VentasTable.tsx) | TypeScript JSX | 125 | 0 | 8 | 133 |
| [frontend/src/features/ventas/hooks/useVentas.ts](/frontend/src/features/ventas/hooks/useVentas.ts) | TypeScript | 162 | 6 | 16 | 184 |
| [frontend/src/features/ventas/pages/VentaDetallePage.tsx](/frontend/src/features/ventas/pages/VentaDetallePage.tsx) | TypeScript JSX | 41 | 0 | 7 | 48 |
| [frontend/src/features/ventas/pages/VentaFormPage.tsx](/frontend/src/features/ventas/pages/VentaFormPage.tsx) | TypeScript JSX | 28 | 0 | 4 | 32 |
| [frontend/src/features/ventas/pages/VentasPage.tsx](/frontend/src/features/ventas/pages/VentasPage.tsx) | TypeScript JSX | 38 | 0 | 7 | 45 |
| [frontend/src/features/ventas/schemas/devolucion.schema.ts](/frontend/src/features/ventas/schemas/devolucion.schema.ts) | TypeScript | 13 | 0 | 3 | 16 |
| [frontend/src/features/ventas/schemas/venta.schema.ts](/frontend/src/features/ventas/schemas/venta.schema.ts) | TypeScript | 29 | 0 | 4 | 33 |
| [frontend/src/features/ventas/types.ts](/frontend/src/features/ventas/types.ts) | TypeScript | 106 | 9 | 14 | 129 |
| [frontend/src/index.css](/frontend/src/index.css) | PostCSS | 0 | 0 | 1 | 1 |
| [frontend/src/lib/PaginaEnConstruccion.tsx](/frontend/src/lib/PaginaEnConstruccion.tsx) | TypeScript JSX | 17 | 4 | 2 | 23 |
| [frontend/src/lib/format.ts](/frontend/src/lib/format.ts) | TypeScript | 13 | 2 | 2 | 17 |
| [frontend/src/lib/queryClient.ts](/frontend/src/lib/queryClient.ts) | TypeScript | 10 | 0 | 2 | 12 |
| [frontend/src/main.tsx](/frontend/src/main.tsx) | TypeScript JSX | 22 | 0 | 5 | 27 |
| [frontend/src/mocks/browser.ts](/frontend/src/mocks/browser.ts) | TypeScript | 3 | 0 | 2 | 5 |
| [frontend/src/mocks/data/catalogo.ts](/frontend/src/mocks/data/catalogo.ts) | TypeScript | 425 | 24 | 10 | 459 |
| [frontend/src/mocks/data/clientes.ts](/frontend/src/mocks/data/clientes.ts) | TypeScript | 232 | 4 | 7 | 243 |
| [frontend/src/mocks/data/compras.ts](/frontend/src/mocks/data/compras.ts) | TypeScript | 340 | 4 | 10 | 354 |
| [frontend/src/mocks/data/configuracion.ts](/frontend/src/mocks/data/configuracion.ts) | TypeScript | 86 | 0 | 4 | 90 |
| [frontend/src/mocks/data/inventario.ts](/frontend/src/mocks/data/inventario.ts) | TypeScript | 144 | 36 | 9 | 189 |
| [frontend/src/mocks/data/pedidos.ts](/frontend/src/mocks/data/pedidos.ts) | TypeScript | 156 | 4 | 4 | 164 |
| [frontend/src/mocks/data/recuperacion.ts](/frontend/src/mocks/data/recuperacion.ts) | TypeScript | 4 | 7 | 2 | 13 |
| [frontend/src/mocks/data/seguridad.ts](/frontend/src/mocks/data/seguridad.ts) | TypeScript | 201 | 11 | 14 | 226 |
| [frontend/src/mocks/data/usuarios.ts](/frontend/src/mocks/data/usuarios.ts) | TypeScript | 57 | 10 | 6 | 73 |
| [frontend/src/mocks/data/ventas.ts](/frontend/src/mocks/data/ventas.ts) | TypeScript | 172 | 3 | 6 | 181 |
| [frontend/src/mocks/handlers/auth.handlers.ts](/frontend/src/mocks/handlers/auth.handlers.ts) | TypeScript | 168 | 7 | 31 | 206 |
| [frontend/src/mocks/handlers/catalogo.handlers.ts](/frontend/src/mocks/handlers/catalogo.handlers.ts) | TypeScript | 162 | 6 | 21 | 189 |
| [frontend/src/mocks/handlers/clientes.handlers.ts](/frontend/src/mocks/handlers/clientes.handlers.ts) | TypeScript | 281 | 28 | 56 | 365 |
| [frontend/src/mocks/handlers/compras.handlers.ts](/frontend/src/mocks/handlers/compras.handlers.ts) | TypeScript | 551 | 34 | 106 | 691 |
| [frontend/src/mocks/handlers/configuracion.handlers.ts](/frontend/src/mocks/handlers/configuracion.handlers.ts) | TypeScript | 188 | 9 | 30 | 227 |
| [frontend/src/mocks/handlers/index.ts](/frontend/src/mocks/handlers/index.ts) | TypeScript | 20 | 0 | 2 | 22 |
| [frontend/src/mocks/handlers/inventario.handlers.ts](/frontend/src/mocks/handlers/inventario.handlers.ts) | TypeScript | 235 | 12 | 38 | 285 |
| [frontend/src/mocks/handlers/pedidos.handlers.ts](/frontend/src/mocks/handlers/pedidos.handlers.ts) | TypeScript | 215 | 13 | 27 | 255 |
| [frontend/src/mocks/handlers/usuarios.handlers.ts](/frontend/src/mocks/handlers/usuarios.handlers.ts) | TypeScript | 211 | 22 | 48 | 281 |
| [frontend/src/mocks/handlers/ventas.handlers.ts](/frontend/src/mocks/handlers/ventas.handlers.ts) | TypeScript | 362 | 18 | 53 | 433 |
| [frontend/src/pages/AccesoDenegadoPage.tsx](/frontend/src/pages/AccesoDenegadoPage.tsx) | TypeScript JSX | 13 | 4 | 2 | 19 |
| [frontend/src/pages/NotFoundPage.tsx](/frontend/src/pages/NotFoundPage.tsx) | TypeScript JSX | 12 | 0 | 2 | 14 |
| [frontend/src/router/AdminRoute.tsx](/frontend/src/router/AdminRoute.tsx) | TypeScript JSX | 34 | 10 | 10 | 54 |
| [frontend/src/router/roles.ts](/frontend/src/router/roles.ts) | TypeScript | 21 | 17 | 4 | 42 |
| [frontend/src/router/routes.tsx](/frontend/src/router/routes.tsx) | TypeScript JSX | 89 | 4 | 8 | 101 |
| [frontend/src/store/useUiStore.ts](/frontend/src/store/useUiStore.ts) | TypeScript | 11 | 4 | 3 | 18 |
| [frontend/src/styles/bootstrap-overrides.css](/frontend/src/styles/bootstrap-overrides.css) | PostCSS | 76 | 4 | 10 | 90 |
| [frontend/src/styles/globals.css](/frontend/src/styles/globals.css) | PostCSS | 49 | 2 | 13 | 64 |
| [frontend/src/styles/variables.css](/frontend/src/styles/variables.css) | PostCSS | 54 | 14 | 9 | 77 |
| [frontend/tsconfig.app.json](/frontend/tsconfig.app.json) | JSON | 22 | 2 | 3 | 27 |
| [frontend/tsconfig.json](/frontend/tsconfig.json) | JSON with Comments | 7 | 0 | 1 | 8 |
| [frontend/tsconfig.node.json](/frontend/tsconfig.node.json) | JSON | 19 | 2 | 3 | 24 |
| [frontend/vite.config.ts](/frontend/vite.config.ts) | TypeScript | 5 | 1 | 2 | 8 |
| [infra/docker-compose.yml](/infra/docker-compose.yml) | YAML | 55 | 18 | 4 | 77 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)