// Tipos para el módulo de Reportes

export interface ReporteVentasCompras {
  periodo: string;
  totalVentas: number;
  totalCompras: number;
  cantidadVentas: number;
  cantidadCompras: number;
  ventas: any[]; // Factura[]
  compras: any[]; // Factura[]
}

export interface ReporteMovimientoMercancia {
  nombreProducto: string;
  stockInicial: number;
  cantidadVendida: number;
  cantidadComprada: number;
  stockFinal: number;
  variacionStock: number;
}

export interface ReporteAlertaInventario {
  nombreProducto: string;
  stockActual: number;
  stockSugerido: number;
  tipoAlerta: string;
  mensaje: string;
  severidad: string;
  precioUnitario: number;
}

export interface ResumenAlertas {
  criticas: number;
  altas: number;
  medias: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Tipos para filtros de fechas
export interface FiltroFecha {
  fecha: string;
  año: number;
  mes: number;
}

export interface FiltroRangoFechas {
  fechaInicio: string;
  fechaFin: string;
}
