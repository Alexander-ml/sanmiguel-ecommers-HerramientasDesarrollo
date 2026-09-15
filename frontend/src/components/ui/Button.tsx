import { forwardRef, type ReactNode } from 'react';
import { Button as BsButton, Spinner, type ButtonProps as BsButtonProps } from 'react-bootstrap';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'link' | 'outline-primary' | 'outline-danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<BsButtonProps, 'variant' | 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
}

/**
 * Componente único de botón del sistema San Miguel (Design System §2.2 / Bloque C).
 * Unifica las variantes visuales en toda la aplicación:
 * - `primary`: Acción principal de la pantalla (una sola por vista).
 * - `secondary`: Acción secundaria/cancelar (outline neutro).
 * - `danger`: Acción destructiva (eliminar, anular).
 * - `ghost`/`link`: Acciones terciarias y de navegación sutil.
 * Tamaños estándar Bootstrap: `sm`, `md`, `lg`.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText,
      icon,
      children,
      disabled,
      className = '',
      ...props
    },
    ref,
  ) => {
    // Mapeo a variantes nativas de react-bootstrap
    let bsVariant: string;
    let extraClass = '';

    switch (variant) {
      case 'primary':
        bsVariant = 'primary';
        break;
      case 'secondary':
        bsVariant = 'outline-secondary';
        break;
      case 'danger':
        bsVariant = 'danger';
        break;
      case 'outline-danger':
        bsVariant = 'outline-danger';
        break;
      case 'outline-primary':
        bsVariant = 'outline-primary';
        break;
      case 'ghost':
        bsVariant = 'link';
        extraClass = 'text-decoration-none text-muted';
        break;
      case 'link':
        bsVariant = 'link';
        extraClass = 'text-decoration-none p-0';
        break;
      default:
        bsVariant = 'primary';
    }

    const bsSize = size === 'md' ? undefined : size;

    return (
      <BsButton
        ref={ref}
        variant={bsVariant}
        size={bsSize}
        disabled={disabled || isLoading}
        className={`d-inline-flex align-items-center justify-content-center gap-1 fw-medium ${extraClass} ${className}`.trim()}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="me-1"
            />
            <span>{loadingText ?? children}</span>
          </>
        ) : (
          <>
            {icon && <span className="d-inline-flex align-items-center">{icon}</span>}
            {children}
          </>
        )}
      </BsButton>
    );
  },
);

Button.displayName = 'Button';
