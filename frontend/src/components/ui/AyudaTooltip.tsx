import type { ReactNode } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

interface AyudaTooltipProps {
    /** Texto que aparece en el tooltip. */
    texto: string;
    /** Contenido que dispara el tooltip. Si no se pasa, se usa un ícono ?. */
    children?: ReactNode;
    /** Dónde aparece el tooltip respecto al trigger. */
    posicion?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Tooltip de ayuda contextual reutilizable.
 * Accesible por teclado (tabIndex=0) y con cursor visual "help".
 *
 * Uso:
 *   <AyudaTooltip texto="Usa tu correo registrado" />
 *   <AyudaTooltip texto="..." posicion="right"><i className="bi bi-info-circle" /></AyudaTooltip>
 */
export function AyudaTooltip({ texto, children, posicion = 'top' }: AyudaTooltipProps) {
    return (
        <OverlayTrigger placement={posicion} overlay={<Tooltip>{texto}</Tooltip>}>
            <span
                className="ms-1 text-muted"
                style={{ cursor: 'help', display: 'inline-flex', alignItems: 'center' }}
                tabIndex={0}
                aria-label={texto}
            >
                {children ?? <i className="bi bi-question-circle small" aria-hidden="true" />}
            </span>
        </OverlayTrigger>
    );
}