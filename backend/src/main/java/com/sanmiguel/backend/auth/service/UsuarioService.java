package com.sanmiguel.backend.auth.service;

import com.sanmiguel.backend.auth.dto.UsuarioCreateRequest;
import com.sanmiguel.backend.auth.dto.UsuarioResumenDTO;
import com.sanmiguel.backend.auth.entity.Rol;
import com.sanmiguel.backend.auth.entity.Usuario;
import com.sanmiguel.backend.auth.repository.RolRepository;
import com.sanmiguel.backend.auth.repository.UsuarioRepository;
import com.sanmiguel.backend.common.exception.BusinessRuleException;
import com.sanmiguel.backend.common.exception.ResourceNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, RolRepository rolRepository,
                          PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UsuarioResumenDTO crear(UsuarioCreateRequest request) {
        usuarioRepository.findByCorreo(request.correo()).ifPresent(u -> {
            throw new BusinessRuleException("Ya existe un usuario con ese correo", "EMAIL_YA_EXISTE");
        });

        Rol rol = rolRepository.findById(request.rolId())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado: " + request.rolId()));

        Usuario usuario = new Usuario(
                request.nombre(), request.correo(), passwordEncoder.encode(request.contrasena()), rol);
        usuarioRepository.save(usuario);

        return new UsuarioResumenDTO(usuario.getId(), usuario.getNombre(), usuario.getCorreo(), rol.getNombre());
    }
}