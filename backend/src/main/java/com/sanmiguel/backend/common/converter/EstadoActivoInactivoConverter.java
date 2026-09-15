package com.sanmiguel.backend.common.converter;

import com.sanmiguel.backend.common.enums.EstadoActivoInactivo;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class EstadoActivoInactivoConverter implements AttributeConverter<EstadoActivoInactivo, String> {

    @Override
    public String convertToDatabaseColumn(EstadoActivoInactivo attribute) {
        return attribute == null ? null : attribute.name().toLowerCase();
    }

    @Override
    public EstadoActivoInactivo convertToEntityAttribute(String dbData) {
        return dbData == null ? null : EstadoActivoInactivo.valueOf(dbData.toUpperCase());
    }
}