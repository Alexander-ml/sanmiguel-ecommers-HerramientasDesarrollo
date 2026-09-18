package com.sanmiguel.backend.auth.entity;

import jakarta.persistence.Column;
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
@Table(name = "sesiones")
public class Sesion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "token_hash", nullable = false, unique = true, length = 255)
    private String tokenHash;

    @Column(name = "fecha_emision", nullable = false, updatable = false)
    private LocalDateTime fechaEmision;

    @Column(name = "fecha_expiracion", nullable = false)
    private LocalDateTime fechaExpiracion;

    @Column(name = "revocado_en")
    private LocalDateTime revocadoEn;

    protected Sesion() {
    }

    public Sesion(Usuario usuario, String tokenHash, LocalDateTime fechaExpiracion) {
        this.usuario = usuario;
        this.tokenHash = tokenHash;
        this.fechaEmision = LocalDateTime.now();
        this.fechaExpiracion = fechaExpiracion;
    }

    public Long getId() { return id; }
    public Usuario getUsuario() { return usuario; }
    public String getTokenHash() { return tokenHash; }
    public LocalDateTime getFechaEmision() { return fechaEmision; }
    public LocalDateTime getFechaExpiracion() { return fechaExpiracion; }
    public LocalDateTime getRevocadoEn() { return revocadoEn; }

    public void revocar() {
        this.revocadoEn = LocalDateTime.now();
    }

    public boolean esValida() {
        return revocadoEn == null && fechaExpiracion.isAfter(LocalDateTime.now());
    }
}