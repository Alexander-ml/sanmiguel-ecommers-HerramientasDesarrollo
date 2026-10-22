package com.sanmiguel.backend.inventario.entity;

import com.sanmiguel.backend.common.converter.EstadoActivoInactivoConverter;
import com.sanmiguel.backend.common.enums.EstadoActivoInactivo;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Producto del catálogo (tabla {@code productos}, módulo Inventario y Catálogo).
 *
 * Representa el artículo "padre" (nombre, marca, precio de lista). Las tallas y colores
 * concretas viven en la tabla {@code variantes}, y el stock en {@code stock}.
 */
@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false, length = 150)
    private String nombre;

    // TEXT en MySQL: columnDefinition evita que "ddl-auto: validate" lo compare contra VARCHAR(255).
    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    // FK hacia categorias.id (NOT NULL). Se mapea como id simple porque la entidad Categoria
    // todavía no existe; cuando se cree, este campo puede pasar a @ManyToOne(fetch = LAZY).
    @Column(name = "categoria_id", nullable = false)
    private Long categoriaId;

    @Column(name = "marca", length = 100)
    private String marca;

    @Column(name = "precio_base", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioBase;

    @Convert(converter = EstadoActivoInactivoConverter.class)
    @Column(name = "estado", nullable = false, columnDefinition = "ENUM('activo','inactivo')")
    private EstadoActivoInactivo estado;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_baja")
    private LocalDateTime fechaBaja;

    protected Producto() {
    }

    public Producto(String nombre, String descripcion, Long categoriaId, String marca, BigDecimal precioBase) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.categoriaId = categoriaId;
        this.marca = marca;
        this.precioBase = precioBase;
        this.estado = EstadoActivoInactivo.ACTIVO;
        this.fechaCreacion = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getDescripcion() { return descripcion; }
    public Long getCategoriaId() { return categoriaId; }
    public String getMarca() { return marca; }
    public BigDecimal getPrecioBase() { return precioBase; }
    public EstadoActivoInactivo getEstado() { return estado; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public LocalDateTime getFechaBaja() { return fechaBaja; }

    public void actualizarDatos(String nombre, String descripcion, Long categoriaId, String marca, BigDecimal precioBase) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.categoriaId = categoriaId;
        this.marca = marca;
        this.precioBase = precioBase;
    }

    /** Baja lógica: el producto no se borra, queda inactivo con su fecha de baja. */
    public void darDeBaja() {
        this.estado = EstadoActivoInactivo.INACTIVO;
        this.fechaBaja = LocalDateTime.now();
    }

    public void reactivar() {
        this.estado = EstadoActivoInactivo.ACTIVO;
        this.fechaBaja = null;
    }

    public boolean estaActivo() {
        return estado == EstadoActivoInactivo.ACTIVO;
    }
}
