import axios from 'axios';
import { Persona, EstadisticasPersonas, ApiResponse } from '../types/Persona';
import { Usuario, EstadisticasUsuarios, UsuarioCreateRequest, UsuarioUpdateRequest } from '../types/Usuario';
import { Producto, EstadisticasProductos } from '../types/Producto';
import { 
  Factura, 
  DetalleFactura, 
  TipoFactura,
  EstadoFactura, 
  EstadisticasFacturas, 
  FacturaCreateRequest, 
  FacturaUpdateRequest,
  AnularFacturaRequest 
} from '../types/Factura';
import {
  ReporteVentasCompras,
  ReporteMovimientoMercancia,
  ReporteAlertaInventario,
  ResumenAlertas
} from '../types/Reportes';

const API_BASE_URL = 'http://localhost:8081/crm';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const personaService = {
  // Obtener todas las personas
  obtenerTodas: async (): Promise<Persona[]> => {
    const response = await api.get('/personas/api');
    return response.data;
  },

  // Obtener una persona por ID
  obtenerPorId: async (id: number): Promise<Persona> => {
    const response = await api.get(`/personas/api/${id}`);
    return response.data;
  },

  // Crear nueva persona
  crear: async (persona: Persona): Promise<Persona> => {
    const response = await api.post('/personas/api', persona);
    return response.data;
  },

  // Actualizar persona
  actualizar: async (id: number, persona: Persona): Promise<Persona> => {
    const response = await api.put(`/personas/api/${id}`, persona);
    return response.data;
  },

  // Eliminar persona
  eliminar: async (id: number): Promise<ApiResponse<any>> => {
    const response = await api.delete(`/personas/api/${id}`);
    return response.data;
  },

  // Buscar personas por término
  buscar: async (termino: string): Promise<Persona[]> => {
    const response = await api.get(`/personas/api/buscar?termino=${encodeURIComponent(termino)}`);
    return response.data;
  },

  // Filtrar por rol
  filtrarPorRol: async (rol: string): Promise<Persona[]> => {
    const response = await api.get(`/personas/api/filtrar/rol/${encodeURIComponent(rol)}`);
    return response.data;
  },

  // Filtrar por sexo
  filtrarPorSexo: async (sexo: string): Promise<Persona[]> => {
    const response = await api.get(`/personas/api/filtrar/sexo/${sexo}`);
    return response.data;
  },

  // Obtener estadísticas
  obtenerEstadisticas: async (): Promise<EstadisticasPersonas> => {
    const response = await api.get('/personas/api/estadisticas');
    return response.data;
  },

  // Verificar si existe cédula
  verificarCedula: async (cedula: string): Promise<boolean> => {
    const response = await api.get(`/personas/api/verificar-cedula/${cedula}`);
    return response.data.existe;
  },

  // Limpiar duplicados
  limpiarDuplicados: async (): Promise<ApiResponse<any>> => {
    const response = await api.post('/personas/api/limpiar-duplicados');
    return response.data;
  }
};

export const usuarioService = {
  // Obtener todas las personas disponibles para crear usuarios
  obtenerPersonasDisponibles: async (): Promise<Persona[]> => {
    const response = await api.get('/usuarios/api/personas-disponibles');
    return response.data.personas;
  },

  // Obtener todos los usuarios
  obtenerTodos: async (): Promise<Usuario[]> => {
    const response = await api.get('/usuarios/api');
    return response.data.usuarios;
  },

  // Obtener un usuario por ID
  obtenerPorId: async (id: number): Promise<Usuario> => {
    const response = await api.get(`/usuarios/api/${id}`);
    return response.data.usuario;
  },

  // Crear un nuevo usuario
  crear: async (usuario: UsuarioCreateRequest): Promise<Usuario> => {
    const response = await api.post('/usuarios/api', usuario);
    return response.data.usuario;
  },

  // Actualizar un usuario existente
  actualizar: async (id: number, usuario: UsuarioUpdateRequest): Promise<Usuario> => {
    const response = await api.put(`/usuarios/api/${id}`, usuario);
    return response.data.usuario;
  },

  // Eliminar un usuario
  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/usuarios/api/${id}`);
  },

  // Buscar usuarios por término
  buscar: async (termino: string): Promise<Usuario[]> => {
    const response = await api.get(`/usuarios/api/buscar?termino=${encodeURIComponent(termino)}`);
    return response.data.usuarios;
  },

  // Obtener estadísticas de usuarios
  obtenerEstadisticas: async (): Promise<EstadisticasUsuarios> => {
    const response = await api.get('/usuarios/api/estadisticas');
    return response.data.estadisticas;
  }
};

export const productoService = {
  // Obtener todos los productos
  obtenerTodos: async (): Promise<Producto[]> => {
    const response = await api.get('/productos/api');
    return response.data;
  },

  // Obtener un producto por ID
  obtenerPorId: async (id: number): Promise<Producto> => {
    const response = await api.get(`/productos/api/${id}`);
    return response.data;
  },

  // Crear nuevo producto
  crear: async (producto: Producto): Promise<Producto> => {
    const response = await api.post('/productos/api', producto);
    return response.data;
  },

  // Actualizar producto
  actualizar: async (id: number, producto: Producto): Promise<Producto> => {
    const response = await api.put(`/productos/api/${id}`, producto);
    return response.data;
  },

  // Eliminar producto
  eliminar: async (id: number): Promise<ApiResponse<any>> => {
    const response = await api.delete(`/productos/api/${id}`);
    return response.data;
  },

  // Buscar productos por término
  buscar: async (termino: string): Promise<Producto[]> => {
    const response = await api.get(`/productos/api/buscar?termino=${encodeURIComponent(termino)}`);
    return response.data;
  },

  // Filtrar por categoría
  filtrarPorCategoria: async (categoria: string): Promise<Producto[]> => {
    const response = await api.get(`/productos/api/filtrar/categoria/${encodeURIComponent(categoria)}`);
    return response.data;
  },

  // Filtrar por estado
  filtrarPorEstado: async (estado: string): Promise<Producto[]> => {
    const response = await api.get(`/productos/api/filtrar/estado/${estado}`);
    return response.data;
  },

  // Obtener productos con stock bajo
  obtenerProductosConStockBajo: async (): Promise<Producto[]> => {
    const response = await api.get('/productos/api/stock-bajo');
    return response.data;
  },

  // Obtener productos agotados
  obtenerProductosAgotados: async (): Promise<Producto[]> => {
    const response = await api.get('/productos/api/agotados');
    return response.data;
  },

  // Obtener estadísticas
  obtenerEstadisticas: async (): Promise<EstadisticasProductos> => {
    const response = await api.get('/productos/api/estadisticas');
    return response.data;
  },

  // Verificar si existe código
  verificarCodigo: async (codigo: string): Promise<boolean> => {
    const response = await api.get(`/productos/api/verificar-codigo/${codigo}`);
    return response.data.existe;
  },

  // Actualizar stock
  actualizarStock: async (id: number, stock: number): Promise<Producto> => {
    const response = await api.put(`/productos/api/${id}/stock?stock=${stock}`);
    return response.data;
  },

  // Reducir stock
  reducirStock: async (id: number, cantidad: number): Promise<Producto> => {
    const response = await api.put(`/productos/api/${id}/reducir-stock?cantidad=${cantidad}`);
    return response.data;
  },

  // Aumentar stock
  aumentarStock: async (id: number, cantidad: number): Promise<Producto> => {
    const response = await api.put(`/productos/api/${id}/aumentar-stock?cantidad=${cantidad}`);
    return response.data;
  },

  // Limpiar duplicados
  limpiarDuplicados: async (): Promise<ApiResponse<any>> => {
    const response = await api.post('/productos/api/limpiar-duplicados');
    return response.data;
  }
};

export const facturaService = {
  // Obtener todas las facturas
  obtenerTodas: async (): Promise<Factura[]> => {
    const response = await api.get('/facturas/api');
    return response.data.facturas || []; // Ahora retorna {success, count, facturas}
  },

  // Obtener factura por ID
  obtenerPorId: async (id: number): Promise<Factura> => {
    const response = await api.get(`/facturas/api/${id}`);
    return response.data;
  },

  // Crear nueva factura
  crear: async (factura: FacturaCreateRequest): Promise<Factura> => {
    const response = await api.post('/facturas/api', factura);
    return response.data.factura; // Ahora retorna {success, message, factura}
  },

  // Actualizar factura
  actualizar: async (id: number, factura: FacturaUpdateRequest): Promise<Factura> => {
    const response = await api.put(`/facturas/api/${id}`, factura);
    return response.data;
  },

  // Eliminar factura
  eliminar: async (id: number): Promise<ApiResponse<any>> => {
    const response = await api.delete(`/facturas/api/${id}`);
    return response.data;
  },

  // Anular factura
  anular: async (id: number, motivo: string): Promise<ApiResponse<any>> => {
    const response = await api.post(`/facturas/api/${id}/anular`, { motivo });
    return response.data;
  },

  // Marcar como pagada
  marcarComoPagada: async (id: number): Promise<ApiResponse<any>> => {
    const response = await api.post(`/facturas/api/${id}/pagar`);
    return response.data;
  },

  // Buscar facturas por término
  buscar: async (termino: string): Promise<Factura[]> => {
    const response = await api.get(`/facturas/api/buscar?termino=${encodeURIComponent(termino)}`);
    return response.data;
  },

  // Buscar por tipo
  buscarPorTipo: async (tipo: TipoFactura): Promise<Factura[]> => {
    const response = await api.get(`/facturas/api/tipo/${tipo}`);
    return response.data;
  },

  // Buscar por cliente
  buscarPorCliente: async (clienteId: number): Promise<Factura[]> => {
    const response = await api.get(`/facturas/api/cliente/${clienteId}`);
    return response.data;
  },

  // Buscar por vendedor
  buscarPorVendedor: async (vendedorId: number): Promise<Factura[]> => {
    const response = await api.get(`/facturas/api/vendedor/${vendedorId}`);
    return response.data;
  },

  // Filtrar por estado
  filtrarPorEstado: async (estado: EstadoFactura): Promise<Factura[]> => {
    const response = await api.get(`/facturas/api/filtrar/estado/${estado}`);
    return response.data;
  },

  // Obtener estadísticas
  obtenerEstadisticas: async (): Promise<EstadisticasFacturas> => {
    const response = await api.get('/facturas/api/estadisticas');
    return response.data;
  },

  // Obtener facturas pendientes
  obtenerPendientes: async (): Promise<Factura[]> => {
    const response = await api.get('/facturas/api/pendientes');
    return response.data;
  },

  // Obtener facturas vencidas
  obtenerVencidas: async (): Promise<Factura[]> => {
    const response = await api.get('/facturas/api/vencidas');
    return response.data;
  },

  // Verificar si existe número de factura
  verificarNumeroFactura: async (numeroFactura: string): Promise<{ existe: boolean }> => {
    const response = await api.get(`/facturas/api/verificar-numero/${encodeURIComponent(numeroFactura)}`);
    return response.data;
  }
};

// Servicio de Reportes
export const reporteService = {
  // Reporte de ventas y compras del día
  obtenerVentasComprasDiario: async (fecha: string): Promise<ReporteVentasCompras> => {
    const response = await api.get(`/reportes/ventas-compras/dia?fecha=${fecha}`);
    return response.data.reporte;
  },

  // Reporte de ventas y compras del mes
  obtenerVentasComprasMensual: async (año: number, mes: number): Promise<ReporteVentasCompras> => {
    const response = await api.get(`/reportes/ventas-compras/mes?año=${año}&mes=${mes}`);
    return response.data.reporte;
  },

  // Reporte de movimiento de mercancía
  obtenerMovimientoMercancia: async (fechaInicio: string, fechaFin: string): Promise<{
    movimientos: ReporteMovimientoMercancia[];
    totalMovimientos: number;
  }> => {
    const response = await api.get(`/reportes/movimiento-mercancia?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
    return {
      movimientos: response.data.movimientos,
      totalMovimientos: response.data.totalMovimientos
    };
  },

  // Reporte de alertas de inventario
  obtenerAlertasInventario: async (): Promise<{
    alertas: ReporteAlertaInventario[];
    totalAlertas: number;
    resumen: ResumenAlertas;
  }> => {
    const response = await api.get('/reportes/alertas-inventario');
    return {
      alertas: response.data.alertas,
      totalAlertas: response.data.totalAlertas,
      resumen: response.data.resumen
    };
  },

  // Test endpoint
  test: async (): Promise<any> => {
    const response = await api.get('/reportes/test');
    return response.data;
  }
};

export default api;
