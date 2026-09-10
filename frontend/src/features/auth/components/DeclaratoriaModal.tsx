import { useState } from 'react';
import { Modal, Button as BsButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

/**
 * Modal con la declaratoria de privacidad (Ley N° 29733).
 * Punto 6 de los 15. Se invoca desde el checkbox de aceptación del login.
 */
export function DeclaratoriaModal() {
    const { t } = useTranslation();
    const [abierto, setAbierto] = useState(false);

    return (
        <>
            <button
                type="button"
                className="btn btn-link btn-sm p-0 align-baseline text-decoration-underline"
                onClick={() => setAbierto(true)}
            >
                {t('auth.verDeclaratoria')}
            </button>

            <Modal show={abierto} onHide={() => setAbierto(false)} centered size="lg" scrollable>
                <Modal.Header closeButton>
                    <Modal.Title className="h6 fw-bold mb-0">
                        <i className="bi bi-shield-check me-2" style={{ color: 'var(--sm-primary)' }} />
                        Declaratoria de Privacidad — Ley N° 29733
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body style={{ fontSize: 'var(--sm-text-sm)', lineHeight: 1.7 }}>
                    <p>
                        Los datos personales que proporcionas en este formulario serán tratados por{' '}
                        <strong>San Miguel</strong> con la finalidad de:
                    </p>
                    <ul>
                        <li>Gestionar tu cuenta de usuario y autenticarte en el sistema.</li>
                        <li>Procesar tus pedidos y coordinar entregas.</li>
                        <li>
                            Enviarte comunicaciones relacionadas con el servicio (confirmaciones,
                            actualizaciones de pedido, avisos de seguridad).
                        </li>
                    </ul>

                    <p>
                        Tu información se almacena en servidores seguros y <strong>no será compartida con
                            terceros</strong> sin tu consentimiento expreso, salvo obligación legal.
                    </p>

                    <p>
                        Puedes ejercer tus derechos de <strong>acceso, rectificación, cancelación y
                            oposición</strong> (derechos ARCO) escribiendo a{' '}
                        <strong>privacidad@sanmiguel.pe</strong>.
                    </p>

                    <p className="mb-0 text-muted small">
                        Conservaremos tus datos mientras mantengas una cuenta activa o según lo exija la
                        normativa aplicable. Puedes solicitar la eliminación de tu cuenta en cualquier
                        momento.
                    </p>
                </Modal.Body>

                <Modal.Footer>
                    <BsButton variant="primary" onClick={() => setAbierto(false)}>
                        {t('common.cerrar')}
                    </BsButton>
                </Modal.Footer>
            </Modal>
        </>
    );
}