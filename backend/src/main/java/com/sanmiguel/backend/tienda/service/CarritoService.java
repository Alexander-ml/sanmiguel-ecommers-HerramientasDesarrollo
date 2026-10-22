package com.sanmiguel.backend.tienda.service;

import com.sanmiguel.backend.common.exception.ResourceNotFoundException;
import com.sanmiguel.backend.tienda.dto.CarritoResponseDTO;
import com.sanmiguel.backend.tienda.mapper.CarritoMapper;
import com.sanmiguel.backend.tienda.repository.CarritoRepository;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CarritoService {

    private final CarritoRepository carritoRepository;
    private final CarritoMapper carritoMapper;

    public CarritoService(CarritoRepository carritoRepository, CarritoMapper carritoMapper) {
        this.carritoRepository = carritoRepository;
        this.carritoMapper = carritoMapper;
    }

    @Transactional(readOnly = true)
    public List<CarritoResponseDTO> listar() {
        return carritoRepository.findAll(Sort.by(Sort.Direction.DESC, "id"))
                .stream()
                .map(carritoMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CarritoResponseDTO buscarPorId(Long id) {
        return carritoRepository.findById(id)
                .map(carritoMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Carrito no encontrado: " + id));
    }
}
