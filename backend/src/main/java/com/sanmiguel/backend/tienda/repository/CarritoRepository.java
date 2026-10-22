package com.sanmiguel.backend.tienda.repository;

import com.sanmiguel.backend.tienda.entity.Carrito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarritoRepository extends JpaRepository<Carrito, Long> {
}
