/** Formatea un monto en Soles, igual que las plantillas actuales ('S/' + valor). */
export function formatearMoneda(valor: number): string {
  return `S/ ${valor.toFixed(2)}`;
}

/** Formatea fecha/hora igual que `#temporals.format(x,'dd/MM/yyyy HH:mm')` en las vistas actuales. */
export function formatearFechaHora(fechaIso: string): string {
  const fecha = new Date(fechaIso);
  return fecha.toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
