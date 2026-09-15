package com.sanmiguel.backend.auth.entity;

import com.sanmiguel.backend.common.converter.EstadoActivoInactivoConverter;
import com.sanmiguel.backend.common.enums.EstadoActivoInactivo;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false, length = 150)
    private String nombre;

    @Column(name = "correo", nullable = false, unique = true, length = 150)
    private String correo;

    @Column(name = "contrasena_hash", nullable = false, length = 255)
    private String contrasenaHash;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rol_id", nullable = false)
    private Rol rol;

    @Convert(converter = EstadoActivoInactivoConverter.class)
    @Column(
            name = "estado",
            nullable = false,
            columnDefinition = "ENUM('activo','inactivo')"
    )
    private EstadoActivoInactivo estado;

    @Column(name = "intentos_fallidos_consecutivos", nullable = false)
    private Byte intentosFallidosConsecutivos;

    @Column(name = "bloqueado_hasta")
    private LocalDateTime bloqueadoHasta;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_baja")
    private LocalDateTime fechaBaja;

    protected Usuario() {
        // Constructor requerido por JPA
    }

    public Usuario(
            String nombre,
            String correo,
            String contrasenaHash,
            Rol rol
    ) {
        this.nombre = nombre;
        this.correo = correo;
        this.contrasenaHash = contrasenaHash;
        this.rol = rol;
        this.estado = EstadoActivoInactivo.ACTIVO;
        this.intentosFallidosConsecutivos = 0;
        this.fechaCreacion = LocalDateTime.now();
    }

    // --- Getters ---

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getCorreo() {
        return correo;
    }

    public String getContrasenaHash() {
        return contrasenaHash;
    }

    public Rol getRol() {
        return rol;
    }

    public EstadoActivoInactivo getEstado() {
        return estado;
    }

    public Byte getIntentosFallidosConsecutivos() {
        return intentosFallidosConsecutivos;
    }

    public LocalDateTime getBloqueadoHasta() {
        return bloqueadoHasta;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public LocalDateTime getFechaBaja() {
        return fechaBaja;
    }

    // --- Comportamiento ---

    public void registrarIntentoFallido() {
        this.intentosFallidosConsecutivos++;
    }

    public void bloquearHasta(LocalDateTime hasta) {
        this.bloqueadoHasta = hasta;
    }

    public void reiniciarIntentosFallidos() {
        this.intentosFallidosConsecutivos = 0;
        this.bloqueadoHasta = null;
    }

    public boolean estaBloqueado() {
        return bloqueadoHasta != null
                && bloqueadoHasta.isAfter(LocalDateTime.now());
    }

    public boolean estaActivo() {
        return estado == EstadoActivoInactivo.ACTIVO;
    }
}