export interface Producto {
  id?: number;
  nombre: string;
  descripcion?: string;
  codigo: string;
  precio: number;
  stock: number;
  stockMinimo?: number;
  categoria?: string;
  marca?: string;
  estado: Estado;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export enum Estado {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
  AGOTADO = 'AGOTADO'
}

export interface EstadisticasProductos {
  totalProductos: number;
  productosActivos: number;
  productosInactivos: number;
  productosAgotados: number;
  productosConStockBajo: number;
  valorTotalInventario: number;
  totalProductosEnStock: number;
}

export interface ApiResponse<T> {
  success: boolean;
  mensaje?: string;
  data?: T;
  error?: string;
}
