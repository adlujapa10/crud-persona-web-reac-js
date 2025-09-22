export interface Factura {
  id?: number;
  numeroFactura?: string; // Opcional porque se genera automáticamente
  fechaFactura: string;
  cliente: any; // Persona
  vendedor: any; // Usuario
  subtotal: number;
  impuesto?: number;
  descuento?: number;
  total: number;
  tipo: TipoFactura;
  estado: EstadoFactura;
  observaciones?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  detalles?: DetalleFactura[];
}

export interface DetalleFactura {
  id?: number;
  factura?: Factura;
  producto: any; // Producto
  cantidad: number;
  precioUnitario: number;
  descuento?: number;
  subtotal: number;
}

export enum TipoFactura {
  VENTA = 'VENTA',
  COMPRA = 'COMPRA'
}

export enum EstadoFactura {
  PENDIENTE = 'PENDIENTE',
  PAGADA = 'PAGADA',
  ANULADA = 'ANULADA',
  VENCIDA = 'VENCIDA'
}

export interface EstadisticasFacturas {
  totalFacturas: number;
  facturasPendientes: number;
  facturasPagadas: number;
  facturasAnuladas: number;
  totalVentas: number;
  totalCompras: number;
  totalIngresos: number;
  totalGastos: number;
  totalPendiente: number;
  utilidadNeta?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  mensaje?: string;
  data?: T;
  error?: string;
}

// Interfaces para formularios
export interface FacturaCreateRequest {
  numeroFactura?: string;
  fechaFactura: string;
  clienteId: number;
  vendedorId: number;
  subtotal: number;
  impuesto?: number;
  descuento?: number;
  total: number;
  tipo: TipoFactura;
  estado: EstadoFactura;
  observaciones?: string;
  detalles: DetalleFacturaCreateRequest[];
}

export interface FacturaUpdateRequest {
  numeroFactura?: string;
  fechaFactura?: string;
  clienteId?: number;
  vendedorId?: number;
  subtotal?: number;
  impuesto?: number;
  descuento?: number;
  total?: number;
  tipo?: TipoFactura;
  estado?: EstadoFactura;
  observaciones?: string;
  detalles?: DetalleFacturaUpdateRequest[];
}

export interface DetalleFacturaCreateRequest {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  descuento?: number;
  subtotal: number;
}

export interface DetalleFacturaUpdateRequest {
  id?: number;
  productoId?: number;
  cantidad?: number;
  precioUnitario?: number;
  descuento?: number;
  subtotal?: number;
}

// Interfaces para acciones
export interface AnularFacturaRequest {
  motivo: string;
}

