import axios from 'axios';
import { Persona, EstadisticasPersonas, ApiResponse } from '../types/Persona';

const API_BASE_URL = '/crm';

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
    const response = await api.post('/personas/limpiar-duplicados');
    return response.data;
  }
};

export default api;
