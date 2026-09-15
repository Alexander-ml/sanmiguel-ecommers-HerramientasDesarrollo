import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { Pagination } from '../../../components/ui/Pagination';
import { Button } from '../../../components/ui/Button';
import { StockTable } from './StockTable';
import { StockFilters } from './StockFilters';
import { AjusteStockForm } from './AjusteStockForm';
import { UmbralAlertaModal } from './UmbralAlertaModal';
import { useStock } from '../hooks/useInventario';
import type { Stock } from '../types';

/**
 * Pestaña "Control de Stock" (RF-INV-013/014). Autocontenida — mismo criterio que
 * ProductosTab/CategoriasTab en Catálogo.
 */
export function StockTab() {
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState('');
  const [pagina, setPagina] = useState(1);

  const { data, isLoading, isError, refetch } = useStock({ busqueda, estado, page: pagina });

  const [stockParaAjuste, setStockParaAjuste] = useState<Stock | null>(null);
  const [stockParaUmbral, setStockParaUmbral] = useState<Stock | null>(null);

  return (
    <div>
      <StockFilters
        busqueda={busqueda}
        estado={estado}
        onBusquedaChange={(v) => { setBusqueda(v); setPagina(1); }}
        onEstadoChange={(v) => { setEstado(v); setPagina(1); }}
      />

      {isLoading && <LoadingState etiqueta="Cargando stock…" />}
      {isError && <ErrorState mensaje="No se pudieron cargar el inventario de stock." onReintentar={refetch} />}

      {!isLoading && !isError && data && (
        data.datos.length === 0 ? (
          <EmptyState
            icono="bi-boxes"
            titulo="Sin resultados"
            descripcion="Ninguna variante coincide con los filtros aplicados."
            accion={
              <Button variant="secondary" size="sm" onClick={() => { setBusqueda(''); setEstado(''); }}>
                Limpiar filtros
              </Button>
            }
          />
        ) : (
          <>
            <StockTable
              stocks={data.datos}
              totalVariantes={data.total}
              onAjustar={setStockParaAjuste}
              onConfigurarUmbral={setStockParaUmbral}
              onVerKardex={(s) => navigate(`/admin/inventario/kardex/${s.varianteId}`)}
            />
            <Pagination
              paginaActual={pagina}
              totalPaginas={data.totalPaginas}
              totalItems={data.total}
              itemsPorPagina={15}
              onCambiarPagina={setPagina}
            />
          </>
        )
      )}

      <AjusteStockForm show={stockParaAjuste !== null} stockSeleccionado={stockParaAjuste} onCerrar={() => setStockParaAjuste(null)} />
      <UmbralAlertaModal show={stockParaUmbral !== null} stockSeleccionado={stockParaUmbral} onCerrar={() => setStockParaUmbral(null)} />
    </div>
  );
}
