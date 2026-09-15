import { useState, type FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSeguimientoPedido, useMisPedidos } from '../hooks/usePedidos';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { BuscadorSeguimiento } from '../components/BuscadorSeguimiento';
import { TimelineSeguimiento } from '../components/TimelineSeguimiento';
import { MisPedidosLista } from '../components/MisPedidosLista';

/**
 * Página de Seguimiento de Pedidos (SRP / SOLID / Bloque B).
 * Permite a compradores invitados y registrados consultar el estado en vivo de sus órdenes.
 */
export function SeguimientoPedidoPage() {
  const { codigo: paramCodigo } = useParams<{ codigo?: string }>();
  const navigate = useNavigate();
  const usuario = useAuthStore((s) => s.usuario);

  const [codigoInput, setCodigoInput] = useState(paramCodigo ?? '');
  const [codigoConsultado, setCodigoConsultado] = useState(paramCodigo ?? '');

  const { data: pedido, isLoading, isError } = useSeguimientoPedido(codigoConsultado);
  const { data: misPedidos } = useMisPedidos(usuario?.id ?? null);

  const handleBuscar = (e: FormEvent) => {
    e.preventDefault();
    const c = codigoInput.trim().toUpperCase();
    if (!c) return;
    setCodigoConsultado(c);
    navigate(`/seguimiento/${c}`, { replace: true });
  };

  const handleSeleccionarDeLista = (codigo: string) => {
    setCodigoInput(codigo);
    setCodigoConsultado(codigo);
    navigate(`/seguimiento/${codigo}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Encabezado con identidad de marca */}
      <div className="py-4" style={{ backgroundColor: 'var(--sm-ink)', color: '#ffffff' }}>
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-1 small">
              <li className="breadcrumb-item">
                <Link to="/" className="text-white-50 text-decoration-none">Inicio</Link>
              </li>
              <li className="breadcrumb-item active text-white">Seguimiento de Pedido</li>
            </ol>
          </nav>
          <h1
            className="sm-font-display mb-1"
            style={{ fontSize: 'clamp(1.7rem, 3vw, 2.2rem)', fontWeight: 700 }}
          >
            Estado & Seguimiento de Pedidos
          </h1>
          <p className="small mb-0 text-white-50">
            Rastrea en tiempo real la preparación, reserva y despacho de tus prendas San Miguel.
          </p>
        </div>
      </div>

      <div className="container py-5">
        {/* Buscador de pedido por código */}
        <BuscadorSeguimiento
          codigoInput={codigoInput}
          onCodigoChange={setCodigoInput}
          onSubmit={handleBuscar}
          isLoading={isLoading}
        />

        {/* Mensajes de estado de consulta */}
        {isLoading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="text-muted small mt-2">Buscando pedido {codigoConsultado}…</p>
          </div>
        )}

        {isError && codigoConsultado && (
          <div
            className="alert alert-warning border-0 shadow-sm p-4 text-center mx-auto my-4"
            style={{ maxWidth: 640, borderRadius: 'var(--sm-radius-md)' }}
          >
            <i className="bi bi-exclamation-triangle-fill fs-3 text-warning d-block mb-2" />
            <h2 className="h6 fw-bold mb-1 text-dark">Pedido no encontrado</h2>
            <p className="small text-muted mb-0">
              No encontramos ningún pedido registrado con el código <code>{codigoConsultado}</code>.
              Verifica que esté escrito correctamente o contáctanos por WhatsApp para asistirte.
            </p>
          </div>
        )}

        {/* Detalle y línea de tiempo del pedido consultado */}
        {pedido && <TimelineSeguimiento pedido={pedido} />}

        {/* Historial de pedidos si el usuario ha iniciado sesión */}
        {usuario && misPedidos && (
          <MisPedidosLista
            pedidos={misPedidos}
            onSeleccionarPedido={handleSeleccionarDeLista}
          />
        )}
      </div>
    </>
  );
}
