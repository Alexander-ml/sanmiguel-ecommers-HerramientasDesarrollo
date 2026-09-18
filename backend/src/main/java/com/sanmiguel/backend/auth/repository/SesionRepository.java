package com.sanmiguel.backend.auth.repository;

import com.sanmiguel.backend.auth.entity.Sesion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SesionRepository extends JpaRepository<Sesion, Long> {
    Optional<Sesion> findByTokenHash(String tokenHash);
}