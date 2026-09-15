package com.sanmiguel.backend.auth.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "permisos")
public class Permiso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Short id;

    @Column(name = "modulo", nullable = false, length = 50)
    private String modulo;

    @Column(name = "accion", nullable = false, length = 50)
    private String accion;

    @Column(name = "descripcion", length = 150)
    private String descripcion;

    protected Permiso() {
        // JPA
    }

    public Short getId() {
        return id;
    }

    public String getModulo() {
        return modulo;
    }

    public String getAccion() {
        return accion;
    }

    public String getDescripcion() {
        return descripcion;
    }
}