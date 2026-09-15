package com.sanmiguel.backend.auth.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "roles")
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Byte id;

    @Column(name = "nombre", nullable = false, unique = true, length = 50)
    private String nombre;

    protected Rol() {
        // JPA
    }

    public Rol(Byte id) {
        this.id = id;
    }

    public Byte getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }
}