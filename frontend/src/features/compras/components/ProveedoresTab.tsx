import { useState } from 'react';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { ConfirmDialog } from '../../../components/feedback/ConfirmDialog';
import { Pagination } from '../../../components/ui/Pagination';
import { FiltersBar } from '../../../components/ui/FiltersBar';
import { Button } from '../../../components/ui/Button';
import { ProveedoresTable } from './ProveedoresTable';
import { ProveedorModal } from './ProveedorModal';
import { HistorialProveedorModal } from './HistorialProveedorModal';
import { useProveedores, useBajaProveedor } from '../hooks/useCompras';
import type { Proveedor } from '../types';

/** Pestaña "Proveedores" (RF-COM-001 a 004, 014). Autocontenida. */
export function ProveedoresTab() {
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState('');
  const [pagina, setPagina] = useState(1);

  const { data, isLoading, isError, refetch } = useProveedores({ busqueda, estado, page: pagina });
  const { mutate: darBaja, isPending: dandoBaja } = useBajaProveedor();

  const [proveedorABaja, setProveedorABaja] = useState<Proveedor | null>(null);
  const [proveedorEditar, setProveedorEditar] = useState<Proveedor | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [proveedorHistorial, setProveedorHistorial] = useState<Proveedor | null>(null);

  const totalProveedores = data?.total ?? 0;

  const abrirNuevo = () => {
    setProveedorEditar(null);
    setMostrarModal(true);
  };

  return (
    <div>
      <FiltersBar
        etiquetaBusqueda="Buscar proveedor (razón social, RUC o contacto)"
        busqueda={busqueda}
        placeholderBusqueda="ej. Confecciones San Cristóbal, 20123456789…"
        onBusquedaChange={(v) => { setBusqueda(v); setPagina(1); }}
        filtros={[
          {
            nombre: 'Todos los estados',
            etiqueta: 'Estado de proveedor',
            opciones: [
              { valor: 'activo', etiqueta: 'Activos' },
              { valor: 'inactivo', etiqueta: 'Inactivos' },
            ],
            valor: estado,
            onChange: (v) => { setEstado(v); setPagina(1); },
          },
        ]}
        acciones={
          <Button size="sm" icon={<i className="bi bi-plus-lg" />} onClick={abrirNuevo}>
            Nuevo proveedor
          </Button>
        }
      />

      {isLoading && <LoadingState etiqueta="Cargando proveedores…" />}
      {isError && <ErrorState mensaje="No se pudieron cargar los proveedores." onReintentar={refetch} />}

      {!isLoading && !isError && data && (
        data.datos.length === 0 ? (
          <EmptyState
            icono="bi-truck"
            titulo={busqueda ? 'Sin resultados' : 'Aún no hay proveedores'}
            descripcion={
              busqueda
                ? 'Ningún proveedor coincide con los criterios de búsqueda.'
                : 'Registra el primer proveedor para poder generar órdenes de compra.'
            }
            accion={
              !busqueda ? (
                <Button size="sm" icon={<i className="bi bi-plus-lg" />} onClick={abrirNuevo}>
                  Registrar primer proveedor
                </Button>
              ) : undefined
            }
          />
        ) : (
          <>
            <ProveedoresTable
              proveedores={data.datos}
              totalProveedores={totalProveedores}
              onEditar={(p) => { setProveedorEditar(p); setMostrarModal(true); }}
              onBaja={setProveedorABaja}
              onVerHistorial={setProveedorHistorial}
            />
            <Pagination
              paginaActual={pagina}
              totalPaginas={data.totalPaginas}
              totalItems={data.total}
              itemsPorPagina={10}
              onCambiarPagina={setPagina}
            />
          </>
        )
      )}

      <ProveedorModal
        show={mostrarModal}
        proveedorEditar={proveedorEditar}
        onCerrar={() => { setMostrarModal(false); setProveedorEditar(null); }}
      />

      <HistorialProveedorModal
        show={proveedorHistorial !== null}
        proveedor={proveedorHistorial}
        onCerrar={() => setProveedorHistorial(null)}
      />

      <ConfirmDialog
        show={proveedorABaja !== null}
        titulo="Dar de baja proveedor"
        descripcion={`¿Dar de baja a "${proveedorABaja?.razonSocial}"? El proveedor quedará inactivo y no podrá recibir nuevas órdenes de compra. Su historial se conserva.`}
        textoConfirmar="Dar de baja"
        tono="danger"
        cargando={dandoBaja}
        onConfirmar={() => {
          if (!proveedorABaja) return;
          darBaja(proveedorABaja.id, { onSuccess: () => setProveedorABaja(null) });
        }}
        onCancelar={() => setProveedorABaja(null)}
      />
    </div>
  );
}
