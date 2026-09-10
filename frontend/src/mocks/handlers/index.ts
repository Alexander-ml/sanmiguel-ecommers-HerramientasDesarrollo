import { authHandlers } from './auth.handlers';
import { catalogoHandlers } from './catalogo.handlers';
import { inventarioHandlers } from './inventario.handlers';
import { ventasHandlers } from './ventas.handlers';
import { pedidosHandlers } from './pedidos.handlers';
import { comprasHandlers } from './compras.handlers';
import { clientesHandlers } from './clientes.handlers';
import { usuariosHandlers } from './usuarios.handlers';
import { configuracionHandlers } from './configuracion.handlers';

export const handlers = [
  ...authHandlers,
  ...catalogoHandlers,
  ...inventarioHandlers,
  ...ventasHandlers,
  ...pedidosHandlers,
  ...comprasHandlers,
  ...clientesHandlers,
  ...usuariosHandlers,
  ...configuracionHandlers,
];
