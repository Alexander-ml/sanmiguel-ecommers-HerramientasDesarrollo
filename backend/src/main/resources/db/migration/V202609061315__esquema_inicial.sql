-- SISTEMA DE GESTIÓN COMERCIAL Y E-COMMERCE SAN MIGUEL

-- ================================================================
-- NIVEL 0 - Tablas sin dependencias (13)
-- ================================================================

-- Módulo: Usuarios y Seguridad
CREATE TABLE roles (
  id TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico, pocos valores posibles.',
  nombre VARCHAR(50) NOT NULL UNIQUE COMMENT 'Nombre del rol.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE permisos (
  id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico.',
  modulo VARCHAR(50) NOT NULL COMMENT 'Módulo sobre el que aplica (ej. "inventario", "compras").',
  accion VARCHAR(50) NOT NULL COMMENT 'Acción concreta (ej. "crear", "consultar", "modificar", "dar_baja").',
  descripcion VARCHAR(150) NULL COMMENT 'Descripción legible del permiso.',
  UNIQUE KEY uq_permisos_modulo_accion (modulo, accion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Módulo: Inventario y Catálogo
CREATE TABLE categorias (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico.',
  nombre VARCHAR(100) NOT NULL COMMENT 'Nombre de la categoría.',
  categoria_padre_id BIGINT UNSIGNED NULL COMMENT 'Categoría superior en la jerarquía; NULL si es raíz.',
  estado ENUM('activo','inactivo') NOT NULL DEFAULT 'activo' COMMENT 'Baja lógica.',
  fecha_baja DATETIME NULL COMMENT 'Cuándo se dio de baja, si aplica.',
  CONSTRAINT fk_categorias_padre FOREIGN KEY (categoria_padre_id)
    REFERENCES categorias(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Módulo: Compras
CREATE TABLE proveedores (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico.',
  razon_social VARCHAR(150) NOT NULL COMMENT 'Nombre comercial o razón social.',
  ruc CHAR(11) NOT NULL UNIQUE COMMENT 'RUC del proveedor (11 dígitos en Perú).',
  telefono VARCHAR(20) NULL COMMENT 'Teléfono de contacto.',
  correo VARCHAR(150) NULL COMMENT 'Correo de contacto.',
  condiciones_comerciales TEXT NULL COMMENT 'Condiciones acordadas (plazos, formas de pago).',
  estado ENUM('activo','inactivo') NOT NULL DEFAULT 'activo' COMMENT 'Baja lógica.',
  fecha_baja DATETIME NULL COMMENT 'Cuándo se dio de baja, si aplica.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Módulo: Clientes
CREATE TABLE clientes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico.',
  nombre VARCHAR(150) NOT NULL COMMENT 'Nombre completo.',
  correo VARCHAR(150) NOT NULL UNIQUE COMMENT 'Usado también para iniciar sesión.',
  contrasena_hash VARCHAR(255) NOT NULL COMMENT 'Contraseña protegida, nunca en texto plano.',
  telefono VARCHAR(20) NULL COMMENT 'Teléfono de contacto.',
  documento_identidad VARCHAR(15) NULL COMMENT 'DNI o RUC — lo necesita comprobantes en Ventas.',
  estado ENUM('activo','inactivo') NOT NULL DEFAULT 'activo' COMMENT 'Baja lógica.',
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación de la cuenta.',
  fecha_baja DATETIME NULL COMMENT 'Cuándo se dio de baja, si aplica.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Módulo: Ventas
CREATE TABLE metodos_pago (
  id TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico.',
  nombre VARCHAR(50) NOT NULL UNIQUE COMMENT 'Efectivo, tarjeta, transferencia bancaria, pasarela de pago digital.',
  requiere_confirmacion_manual BOOLEAN NOT NULL COMMENT 'Si TRUE, el pago no se aprueba automáticamente.',
  tiempo_reserva_minutos INT NOT NULL COMMENT 'Duración de la reserva de stock para este método.',
  estado ENUM('activo','inactivo') NOT NULL DEFAULT 'activo' COMMENT 'Permite deshabilitar un método sin borrar su historial.',
  fecha_baja DATETIME NULL COMMENT 'Cuándo se deshabilitó, si aplica.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Catálogos de motivos (Compras y Ventas)
CREATE TABLE motivos_devolucion_proveedor (
  id TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico.',
  descripcion VARCHAR(150) NOT NULL UNIQUE COMMENT 'Ej.: Producto defectuoso de fábrica, Talla incorrecta enviada, Dañado en transporte.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE motivos_devolucion_venta (
  id TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico.',
  descripcion VARCHAR(150) NOT NULL UNIQUE COMMENT 'Ej.: Talla no correspondía, Producto defectuoso, No cumplió expectativas.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Módulo: Configuración General (tablas de una sola fila)
CREATE TABLE empresa (
  id TINYINT UNSIGNED PRIMARY KEY COMMENT 'Fuerza que exista una única fila.',
  razon_social VARCHAR(150) NOT NULL COMMENT 'Razón social de SAN MIGUEL.',
  ruc CHAR(11) NOT NULL COMMENT 'RUC del negocio.',
  telefono VARCHAR(20) NULL COMMENT 'Teléfono de contacto.',
  correo VARCHAR(150) NULL COMMENT 'Correo de contacto.',
  logo_url VARCHAR(255) NULL COMMENT 'Ruta o URL del logo.',
  CONSTRAINT chk_empresa_id_unico CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Tabla de una sola fila.';

CREATE TABLE parametros_comerciales (
  id TINYINT UNSIGNED PRIMARY KEY COMMENT 'Fuerza que exista una única fila.',
  moneda CHAR(3) NOT NULL DEFAULT 'PEN' COMMENT 'Código de moneda ISO 4217.',
  tasa_igv DECIMAL(5,2) NOT NULL DEFAULT 18.00 COMMENT 'Porcentaje de IGV vigente, editable.',
  CONSTRAINT chk_parametroscom_id_unico CHECK (id = 1),
  CONSTRAINT chk_parametroscom_igv CHECK (tasa_igv >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Tabla de una sola fila.';

CREATE TABLE parametros_tienda (
  id TINYINT UNSIGNED PRIMARY KEY COMMENT 'Fuerza que exista una única fila.',
  politica_privacidad TEXT NOT NULL COMMENT 'Texto vigente de la política de privacidad.',
  version_politica_privacidad VARCHAR(20) NOT NULL COMMENT 'Se copia en consentimientos_datos.version_politica.',
  terminos_condiciones TEXT NOT NULL COMMENT 'Texto vigente de los términos y condiciones.',
  CONSTRAINT chk_parametrostienda_id_unico CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Tabla de una sola fila.';

CREATE TABLE parametros_operativos (
  id TINYINT UNSIGNED PRIMARY KEY COMMENT 'Fuerza que exista una única fila.',
  umbral_stock_minimo_defecto INT NOT NULL DEFAULT 5 COMMENT 'Valor de referencia cuando stock.umbral_minimo es NULL.',
  CONSTRAINT chk_parametrosop_id_unico CHECK (id = 1),
  CONSTRAINT chk_parametrosop_umbral CHECK (umbral_stock_minimo_defecto >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Tabla de una sola fila.';

CREATE TABLE parametros_seguridad (
  id TINYINT UNSIGNED PRIMARY KEY COMMENT 'Fuerza que exista una única fila.',
  duracion_token_acceso_minutos INT NOT NULL DEFAULT 15 COMMENT 'Duración de la credencial de acceso de corta duración.',
  duracion_sesion_dias INT NOT NULL DEFAULT 7 COMMENT 'Duración de la credencial de renovación.',
  intentos_fallidos_permitidos TINYINT UNSIGNED NOT NULL DEFAULT 5 COMMENT 'Umbral antes del bloqueo temporal.',
  minutos_bloqueo SMALLINT UNSIGNED NOT NULL DEFAULT 15 COMMENT 'Duración del bloqueo temporal.',
  CONSTRAINT chk_parametrosseg_id_unico CHECK (id = 1),
  CONSTRAINT chk_parametrosseg_token CHECK (duracion_token_acceso_minutos > 0),
  CONSTRAINT chk_parametrosseg_sesion CHECK (duracion_sesion_dias > 0),
  CONSTRAINT chk_parametrosseg_intentos CHECK (intentos_fallidos_permitidos > 0),
  CONSTRAINT chk_parametrosseg_bloqueo CHECK (minutos_bloqueo > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Tabla de una sola fila.';

-- ================================================================
-- NIVEL 1 (6)
-- ================================================================

-- Módulo: Usuarios y Seguridad
CREATE TABLE usuarios (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico.',
  nombre VARCHAR(150) NOT NULL COMMENT 'Nombre completo.',
  correo VARCHAR(150) NOT NULL UNIQUE COMMENT 'Usado para iniciar sesión.',
  contrasena_hash VARCHAR(255) NOT NULL COMMENT 'Contraseña protegida, nunca en texto plano.',
  rol_id TINYINT UNSIGNED NOT NULL COMMENT 'Rol asignado.',
  estado ENUM('activo','inactivo') NOT NULL DEFAULT 'activo' COMMENT 'Baja lógica.',
  intentos_fallidos_consecutivos TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Contador para el bloqueo temporal.',
  bloqueado_hasta DATETIME NULL COMMENT 'Si tiene valor y aún no se cumple, el usuario no puede autenticarse.',
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de alta.',
  fecha_baja DATETIME NULL COMMENT 'Cuándo se dio de baja, si aplica.',
  CONSTRAINT fk_usuarios_rol FOREIGN KEY (rol_id)
    REFERENCES roles(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE rol_permisos (
  rol_id TINYINT UNSIGNED NOT NULL COMMENT 'Rol.',
  permiso_id SMALLINT UNSIGNED NOT NULL COMMENT 'Permiso habilitado para ese rol.',
  PRIMARY KEY (rol_id, permiso_id),
  CONSTRAINT fk_rolpermisos_rol FOREIGN KEY (rol_id)
    REFERENCES roles(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_rolpermisos_permiso FOREIGN KEY (permiso_id)
    REFERENCES permisos(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Módulo: Inventario y Catálogo
CREATE TABLE productos (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico.',
  nombre VARCHAR(150) NOT NULL COMMENT 'Nombre comercial.',
  descripcion TEXT NULL COMMENT 'Descripción para el catálogo.',
  categoria_id BIGINT UNSIGNED NOT NULL COMMENT 'Categoría a la que pertenece.',
  marca VARCHAR(100) NULL COMMENT 'Marca, si aplica.',
  precio_base DECIMAL(10,2) NOT NULL COMMENT 'Precio de lista.',
  estado ENUM('activo','inactivo') NOT NULL DEFAULT 'activo' COMMENT 'Baja lógica.',
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de alta.',
  fecha_baja DATETIME NULL COMMENT 'Cuándo se dio de baja, si aplica.',
  CONSTRAINT fk_productos_categoria FOREIGN KEY (categoria_id)
    REFERENCES categorias(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_productos_precio CHECK (precio_base >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Módulo: Clientes
CREATE TABLE direcciones (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico.',
  cliente_id BIGINT UNSIGNED NOT NULL COMMENT 'Cliente al que pertenece.',
  calle VARCHAR(255) NOT NULL COMMENT 'Calle y número.',
  distrito VARCHAR(100) NOT NULL COMMENT 'Distrito.',
  provincia VARCHAR(100) NOT NULL COMMENT 'Provincia.',
  referencia VARCHAR(255) NULL COMMENT 'Referencia adicional.',
  es_predeterminada BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Marca la dirección usada por defecto en el checkout.',
  CONSTRAINT fk_direcciones_cliente FOREIGN KEY (cliente_id)
    REFERENCES clientes(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Módulo: Tienda
CREATE TABLE carritos (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico.',
  cliente_id BIGINT UNSIGNED NULL COMMENT 'Si el comprador está autenticado.',
  sesion_token VARCHAR(100) NULL COMMENT 'Identificador de sesión anónima, si es invitado.',
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Cuándo se creó el carrito.',
  fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Última modificación.',
  CONSTRAINT fk_carritos_cliente FOREIGN KEY (cliente_id)
    REFERENCES clientes(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT chk_carritos_identificacion CHECK (cliente_id IS NOT NULL OR sesion_token IS NOT NULL)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE pedidos (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico.',
  cliente_id BIGINT UNSIGNED NULL COMMENT 'NULL si es una compra de invitado.',
  nombre_contacto VARCHAR(150) NOT NULL COMMENT 'Nombre del comprador, registrado o invitado.',
  correo_contacto VARCHAR(150) NOT NULL COMMENT 'Correo del comprador.',
  telefono_contacto VARCHAR(20) NULL COMMENT 'Teléfono del comprador.',
  tipo_entrega ENUM('envio_domicilio','recojo_tienda') NOT NULL DEFAULT 'envio_domicilio' COMMENT 'Preferencia de entrega.',
  direccion_calle VARCHAR(255) NULL COMMENT 'Copia de la dirección al momento del checkout.',
  direccion_distrito VARCHAR(100) NULL COMMENT 'Copia del distrito.',
  direccion_provincia VARCHAR(100) NULL COMMENT 'Copia de la provincia.',
  direccion_referencia VARCHAR(255) NULL COMMENT 'Referencia adicional de la dirección.',
  metodo_pago_id TINYINT UNSIGNED NOT NULL COMMENT 'Método elegido en el checkout.',
  estado ENUM('pendiente_pago','en_espera_confirmacion','confirmado','en_preparacion','listo_entregado','cancelado')
    NOT NULL DEFAULT 'pendiente_pago' COMMENT 'Estado del pedido.',
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha del pedido.',
  fecha_expiracion_reserva DATETIME NULL COMMENT 'Cuándo expira la reserva de stock asociada.',
  CONSTRAINT fk_pedidos_cliente FOREIGN KEY (cliente_id)
    REFERENCES clientes(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_pedidos_metodo FOREIGN KEY (metodo_pago_id)
    REFERENCES metodos_pago(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_pedidos_direccion CHECK (
    tipo_entrega = 'recojo_tienda' OR (direccion_calle IS NOT NULL AND direccion_distrito IS NOT NULL)
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- NIVEL 2 (9)
-- ================================================================

-- Módulo: Usuarios y Seguridad
CREATE TABLE sesiones (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico.',
  usuario_id BIGINT UNSIGNED NOT NULL COMMENT 'Usuario dueño de la sesión.',
  token_hash VARCHAR(255) NOT NULL UNIQUE COMMENT 'Hash de la credencial de renovación, nunca el token en claro.',
  fecha_emision DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Cuándo se emitió.',
  fecha_expiracion DATETIME NOT NULL COMMENT 'Vencimiento natural de la sesión.',
  revocado_en DATETIME NULL COMMENT 'Cuándo se revocó antes de expirar.',
  CONSTRAINT fk_sesiones_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE eventos_seguridad (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico.',
  usuario_id BIGINT UNSIGNED NULL COMMENT 'NULL si el intento fallido usó un correo sin usuario asociado.',
  correo_intento VARCHAR(150) NULL COMMENT 'Correo usado en el intento.',
  tipo ENUM('login_exitoso','login_fallido','logout','revocacion') NOT NULL COMMENT 'Tipo de evento.',
  ip_origen VARCHAR(45) NULL COMMENT 'Dirección IP de origen (largo suficiente para IPv6).',
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Momento del evento.',
  CONSTRAINT fk_eventosseguridad_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Módulo: Configuración General
CREATE TABLE registro_cambios_configuracion (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico.',
  tabla_afectada VARCHAR(50) NOT NULL COMMENT 'Cuál de las tablas de configuración cambió.',
  campo_afectado VARCHAR(50) NOT NULL COMMENT 'Qué columna cambió.',
  valor_anterior VARCHAR(255) NULL COMMENT 'Valor antes del cambio.',
  valor_nuevo VARCHAR(255) NULL COMMENT 'Valor después del cambio.',
  usuario_id BIGINT UNSIGNED NOT NULL COMMENT 'Administrador que hizo el cambio.',
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Cuándo ocurrió.',
  CONSTRAINT fk_registrocambios_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Módulo: Inventario y Catálogo
CREATE TABLE producto_imagenes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico.',
  producto_id BIGINT UNSIGNED NOT NULL COMMENT 'Producto al que pertenece la imagen.',
  url VARCHAR(255) NOT NULL COMMENT 'Ruta o URL de la imagen.',
  orden TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Posición para mostrarla (0 = principal).',
  CONSTRAINT fk_productoimagenes_producto FOREIGN KEY (producto_id)
    REFERENCES productos(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE variantes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico.',
  producto_id BIGINT UNSIGNED NOT NULL COMMENT 'Producto al que pertenece.',
  talla VARCHAR(20) NOT NULL COMMENT 'Talla de la variante.',
  color VARCHAR(50) NOT NULL COMMENT 'Color de la variante.',
  sku VARCHAR(50) NOT NULL UNIQUE COMMENT 'Código único. No es la PK.',
  precio_especifico DECIMAL(10,2) NULL COMMENT 'Precio propio, si difiere del precio base del producto.',
  estado ENUM('activo','inactivo') NOT NULL DEFAULT 'activo' COMMENT 'Baja lógica.',
  fecha_baja DATETIME NULL COMMENT 'Cuándo se dio de baja, si aplica.',
  CONSTRAINT fk_variantes_producto FOREIGN KEY (producto_id)
    REFERENCES productos(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_variantes_precio CHECK (precio_especifico IS NULL OR precio_especifico >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Módulo: Compras
CREATE TABLE ordenes_compra (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico.',
  proveedor_id BIGINT UNSIGNED NOT NULL COMMENT 'Proveedor al que se le compra.',
  usuario_creador_id BIGINT UNSIGNED NOT NULL COMMENT 'Quién registró la orden.',
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación.',
  estado ENUM('pendiente','parcialmente_recibida','recibida','cancelada')
    NOT NULL DEFAULT 'pendiente' COMMENT 'Se recalcula por aplicación, no se fija a mano.',
  estado_pago ENUM('pendiente','pagado') NOT NULL DEFAULT 'pendiente' COMMENT 'Seguimiento simple, sin contabilidad formal.',
  total_estimado DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Suma de los costos de sus líneas.',
  CONSTRAINT fk_ordenescompra_proveedor FOREIGN KEY (proveedor_id)
    REFERENCES proveedores(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_ordenescompra_usuario FOREIGN KEY (usuario_creador_id)
    REFERENCES usuarios(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_ordenescompra_total CHECK (total_estimado >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Módulo: Clientes
CREATE TABLE consentimientos_datos (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico.',
  cliente_id BIGINT UNSIGNED NULL COMMENT 'Si el titular tiene cuenta.',
  pedido_id BIGINT UNSIGNED NULL COMMENT 'Si el titular compró como invitado, sin cuenta.',
  version_politica VARCHAR(20) NOT NULL COMMENT 'Versión de la política de privacidad aceptada.',
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Cuándo se otorgó el consentimiento.',
  revocado_en DATETIME NULL COMMENT 'Cuándo se revocó, si aplica.',
  CONSTRAINT fk_consentimientos_cliente FOREIGN KEY (cliente_id)
    REFERENCES clientes(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_consentimientos_pedido FOREIGN KEY (pedido_id)
    REFERENCES pedidos(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT chk_consentimientos_titular CHECK (cliente_id IS NOT NULL OR pedido_id IS NOT NULL)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE solicitudes_arco (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico.',
  cliente_id BIGINT UNSIGNED NOT NULL COMMENT 'Titular que solicita.',
  tipo ENUM('acceso','rectificacion','cancelacion','oposicion') NOT NULL COMMENT 'Tipo de derecho ARCO ejercido.',
  estado ENUM('pendiente','atendida') NOT NULL DEFAULT 'pendiente' COMMENT 'Estado de la solicitud.',
  fecha_solicitud DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Cuándo se registró.',
  fecha_atencion DATETIME NULL COMMENT 'Cuándo se resolvió.',
  usuario_atencion_id BIGINT UNSIGNED NULL COMMENT 'Administrador que la atendió manualmente, si aplica.',
  observaciones TEXT NULL COMMENT 'Notas sobre la resolución.',
  CONSTRAINT fk_solicitudesarco_cliente FOREIGN KEY (cliente_id)
    REFERENCES clientes(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_solicitudesarco_usuario FOREIGN KEY (usuario_atencion_id)
    REFERENCES usuarios(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Módulo: Ventas
CREATE TABLE ventas (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico.',
  pedido_id BIGINT UNSIGNED NULL COMMENT 'Pedido de origen si el canal es online.',
  cliente_id BIGINT UNSIGNED NULL COMMENT 'Cliente registrado, si lo hay.',
  nombre_contacto VARCHAR(150) NOT NULL COMMENT 'Copia del nombre al momento de la venta.',
  correo_contacto VARCHAR(150) NULL COMMENT 'Copia del correo al momento de la venta.',
  telefono_contacto VARCHAR(20) NULL COMMENT 'Copia del teléfono al momento de la venta.',
  documento_identidad VARCHAR(15) NULL COMMENT 'DNI o RUC, copiado al momento de la venta.',
  canal ENUM('online','presencial') NOT NULL DEFAULT 'online' COMMENT 'Origen de la venta.',
  usuario_vendedor_id BIGINT UNSIGNED NULL COMMENT 'Vendedor responsable, si aplica.',
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de la operación.',
  estado ENUM('pendiente','confirmada','cancelada') NOT NULL DEFAULT 'pendiente' COMMENT 'Estado transaccional.',
  motivo_cancelacion VARCHAR(255) NULL COMMENT 'Motivo, si el estado es cancelada.',
  importe_total DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Suma de detalle_venta.',
  CONSTRAINT fk_ventas_pedido FOREIGN KEY (pedido_id)
    REFERENCES pedidos(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_ventas_cliente FOREIGN KEY (cliente_id)
    REFERENCES clientes(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_ventas_vendedor FOREIGN KEY (usuario_vendedor_id)
    REFERENCES usuarios(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_ventas_importe CHECK (importe_total >= 0),
  CONSTRAINT chk_ventas_canal_pedido CHECK (canal = 'presencial' OR pedido_id IS NOT NULL)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- NIVEL 3 (9)
-- ================================================================

-- Módulo: Inventario y Catálogo
CREATE TABLE stock (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico.',
  variante_id BIGINT UNSIGNED NOT NULL UNIQUE COMMENT 'Relación 1 a 1 con la variante.',
  cantidad_fisica INT NOT NULL DEFAULT 0 COMMENT 'Stock físico real.',
  cantidad_reservada INT NOT NULL DEFAULT 0 COMMENT 'Reservado por pedidos pendientes de pago.',
  cantidad_disponible INT GENERATED ALWAYS AS (cantidad_fisica - cantidad_reservada) VIRTUAL
    COMMENT 'Calculado por MySQL, nunca se escribe directamente.',
  umbral_minimo INT NULL COMMENT 'Si es NULL, se usa el valor por defecto de Configuración General.',
  CONSTRAINT fk_stock_variante FOREIGN KEY (variante_id)
    REFERENCES variantes(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_stock_fisica CHECK (cantidad_fisica >= 0),
  CONSTRAINT chk_stock_reservada CHECK (cantidad_reservada >= 0 AND cantidad_reservada <= cantidad_fisica)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE movimientos_inventario (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico.',
  variante_id BIGINT UNSIGNED NOT NULL COMMENT 'Variante afectada.',
  tipo ENUM('entrada_compra','entrada_devolucion_venta','salida_venta','salida_devolucion_compra','ajuste_positivo','ajuste_negativo')
    NOT NULL COMMENT 'Tipo de movimiento.',
  cantidad INT NOT NULL COMMENT 'Cantidad afectada; siempre positiva, el signo lo determina tipo.',
  saldo_resultante INT NOT NULL COMMENT 'Stock físico después de este movimiento.',
  documento_referencia VARCHAR(100) NULL COMMENT 'Referencia al documento que originó el movimiento.',
  usuario_id BIGINT UNSIGNED NULL COMMENT 'Responsable, obligatorio solo en ajustes manuales.',
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Momento del movimiento.',
  CONSTRAINT fk_movimientos_variante FOREIGN KEY (variante_id)
    REFERENCES variantes(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_movimientos_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT chk_movimientos_cantidad CHECK (cantidad > 0),
  CONSTRAINT chk_movimientos_usuario_ajuste CHECK (
    tipo NOT IN ('ajuste_positivo','ajuste_negativo') OR usuario_id IS NOT NULL
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Módulo: Compras
CREATE TABLE detalle_compra (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico.',
  orden_compra_id BIGINT UNSIGNED NOT NULL COMMENT 'Orden a la que pertenece.',
  variante_id BIGINT UNSIGNED NOT NULL COMMENT 'Variante pedida.',
  cantidad_pedida INT NOT NULL COMMENT 'Cantidad solicitada.',
  cantidad_recibida INT NOT NULL DEFAULT 0 COMMENT 'Acumulado recibido.',
  costo_unitario DECIMAL(10,2) NOT NULL COMMENT 'Costo acordado por unidad.',
  CONSTRAINT fk_detallecompra_orden FOREIGN KEY (orden_compra_id)
    REFERENCES ordenes_compra(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_detallecompra_variante FOREIGN KEY (variante_id)
    REFERENCES variantes(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  UNIQUE KEY uq_detallecompra_orden_variante (orden_compra_id, variante_id),
  CONSTRAINT chk_detallecompra_pedida CHECK (cantidad_pedida > 0),
  CONSTRAINT chk_detallecompra_recibida CHECK (cantidad_recibida >= 0 AND cantidad_recibida <= cantidad_pedida),
  CONSTRAINT chk_detallecompra_costo CHECK (costo_unitario >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE recepciones_compra (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico.',
  orden_compra_id BIGINT UNSIGNED NOT NULL COMMENT 'Orden recibida.',
  usuario_receptor_id BIGINT UNSIGNED NOT NULL COMMENT 'Quién registró la recepción.',
  fecha_recepcion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Momento de la recepción.',
  CONSTRAINT fk_recepciones_orden FOREIGN KEY (orden_compra_id)
    REFERENCES ordenes_compra(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_recepciones_usuario FOREIGN KEY (usuario_receptor_id)
    REFERENCES usuarios(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Módulo: Tienda
CREATE TABLE detalle_carrito (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico.',
  carrito_id BIGINT UNSIGNED NOT NULL COMMENT 'Carrito al que pertenece.',
  variante_id BIGINT UNSIGNED NOT NULL COMMENT 'Variante seleccionada.',
  cantidad INT NOT NULL COMMENT 'Cantidad deseada.',
  CONSTRAINT fk_detallecarrito_carrito FOREIGN KEY (carrito_id)
    REFERENCES carritos(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_detallecarrito_variante FOREIGN KEY (variante_id)
    REFERENCES variantes(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  UNIQUE KEY uq_detallecarrito_carrito_variante (carrito_id, variante_id),
  CONSTRAINT chk_detallecarrito_cantidad CHECK (cantidad > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE detalle_pedido (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico.',
  pedido_id BIGINT UNSIGNED NOT NULL COMMENT 'Pedido al que pertenece.',
  variante_id BIGINT UNSIGNED NOT NULL COMMENT 'Variante solicitada.',
  cantidad INT NOT NULL COMMENT 'Cantidad solicitada.',
  precio_unitario DECIMAL(10,2) NOT NULL COMMENT 'Precio congelado al crear el pedido.',
  CONSTRAINT fk_detallepedido_pedido FOREIGN KEY (pedido_id)
    REFERENCES pedidos(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_detallepedido_variante FOREIGN KEY (variante_id)
    REFERENCES variantes(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  UNIQUE KEY uq_detallepedido_pedido_variante (pedido_id, variante_id),
  CONSTRAINT chk_detallepedido_cantidad CHECK (cantidad > 0),
  CONSTRAINT chk_detallepedido_precio CHECK (precio_unitario >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Módulo: Ventas
CREATE TABLE detalle_venta (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico.',
  venta_id BIGINT UNSIGNED NOT NULL COMMENT 'Venta a la que pertenece.',
  variante_id BIGINT UNSIGNED NOT NULL COMMENT 'Variante vendida.',
  cantidad INT NOT NULL COMMENT 'Cantidad vendida.',
  precio_unitario DECIMAL(10,2) NOT NULL COMMENT 'Precio al momento de la venta.',
  CONSTRAINT fk_detalleventa_venta FOREIGN KEY (venta_id)
    REFERENCES ventas(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_detalleventa_variante FOREIGN KEY (variante_id)
    REFERENCES variantes(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  UNIQUE KEY uq_detalleventa_venta_variante (venta_id, variante_id),
  CONSTRAINT chk_detalleventa_cantidad CHECK (cantidad > 0),
  CONSTRAINT chk_detalleventa_precio CHECK (precio_unitario >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE pagos (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico.',
  venta_id BIGINT UNSIGNED NOT NULL COMMENT 'Venta asociada.',
  metodo_pago_id TINYINT UNSIGNED NOT NULL COMMENT 'Método utilizado.',
  monto DECIMAL(10,2) NOT NULL COMMENT 'Monto del intento de pago.',
  estado ENUM('pendiente','aprobado','rechazado','reembolsado') NOT NULL DEFAULT 'pendiente' COMMENT 'Estado propio del pago.',
  referencia_externa VARCHAR(100) NULL COMMENT 'ID de transacción de la pasarela, si aplica.',
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha del intento.',
  CONSTRAINT fk_pagos_venta FOREIGN KEY (venta_id)
    REFERENCES ventas(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_pagos_metodo FOREIGN KEY (metodo_pago_id)
    REFERENCES metodos_pago(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_pagos_monto CHECK (monto >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE comprobantes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico.',
  venta_id BIGINT UNSIGNED NOT NULL UNIQUE COMMENT 'Una venta confirmada tiene exactamente un comprobante.',
  tipo ENUM('boleta','factura') NOT NULL COMMENT 'Tipo de comprobante.',
  serie VARCHAR(10) NOT NULL COMMENT 'Serie del comprobante.',
  numero BIGINT UNSIGNED NOT NULL COMMENT 'Número correlativo dentro de la serie.',
  fecha_emision DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de emisión.',
  CONSTRAINT fk_comprobantes_venta FOREIGN KEY (venta_id)
    REFERENCES ventas(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  UNIQUE KEY uq_comprobantes_tipo_serie_numero (tipo, serie, numero)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- NIVEL 4 (2)
-- ================================================================

-- Módulo: Compras
CREATE TABLE detalle_recepcion (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico.',
  recepcion_id BIGINT UNSIGNED NOT NULL COMMENT 'Evento de recepción al que pertenece.',
  detalle_compra_id BIGINT UNSIGNED NOT NULL COMMENT 'Línea de la orden que se está recibiendo.',
  cantidad_recibida INT NOT NULL COMMENT 'Cantidad recibida en este evento puntual.',
  CONSTRAINT fk_detallerecepcion_recepcion FOREIGN KEY (recepcion_id)
    REFERENCES recepciones_compra(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_detallerecepcion_detallecompra FOREIGN KEY (detalle_compra_id)
    REFERENCES detalle_compra(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_detallerecepcion_cantidad CHECK (cantidad_recibida > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Módulo: Ventas
CREATE TABLE devoluciones_venta (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico.',
  detalle_venta_id BIGINT UNSIGNED NOT NULL COMMENT 'Línea de la venta que se devuelve.',
  motivo_id TINYINT UNSIGNED NOT NULL COMMENT 'Motivo de la devolución.',
  cantidad INT NOT NULL COMMENT 'Cantidad devuelta.',
  monto_reembolsado DECIMAL(10,2) NOT NULL COMMENT 'Monto devuelto al cliente.',
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de la devolución.',
  CONSTRAINT fk_devolucionesventa_detalle FOREIGN KEY (detalle_venta_id)
    REFERENCES detalle_venta(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_devolucionesventa_motivo FOREIGN KEY (motivo_id)
    REFERENCES motivos_devolucion_venta(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_devolucionesventa_cantidad CHECK (cantidad > 0),
  CONSTRAINT chk_devolucionesventa_monto CHECK (monto_reembolsado >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- NIVEL 5 (1)
-- ================================================================

-- Módulo: Compras
CREATE TABLE devoluciones_proveedor (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador técnico.',
  detalle_recepcion_id BIGINT UNSIGNED NOT NULL COMMENT 'Recepción/línea de origen de lo que se devuelve.',
  motivo_id TINYINT UNSIGNED NOT NULL COMMENT 'Motivo de la devolución.',
  cantidad INT NOT NULL COMMENT 'Cantidad devuelta.',
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de la devolución.',
  CONSTRAINT fk_devolucionesproveedor_detalle FOREIGN KEY (detalle_recepcion_id)
    REFERENCES detalle_recepcion(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_devolucionesproveedor_motivo FOREIGN KEY (motivo_id)
    REFERENCES motivos_devolucion_proveedor(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_devolucionesproveedor_cantidad CHECK (cantidad > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
