import axios from 'axios';
import { LoginRequest, LoginResponse, Usuario } from '../types/Usuario';

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
    console.error('Auth API Error:', error);
    return Promise.reject(error);
  }
);

export const authService = {
  // Login de usuario
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Verificar si un usuario existe
  verificarUsuario: async (usuario: string): Promise<{ existe: boolean; usuario: string }> => {
    const response = await api.get(`/auth/verificar-usuario/${usuario}`);
    return response.data;
  },

  // Guardar usuario en localStorage
  guardarUsuario: (usuario: Usuario): void => {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  },

  // Obtener usuario del localStorage
  obtenerUsuario: (): Usuario | null => {
    const usuarioStr = localStorage.getItem('usuario');
    return usuarioStr ? JSON.parse(usuarioStr) : null;
  },

  // Verificar si el usuario está autenticado
  estaAutenticado: (): boolean => {
    return localStorage.getItem('usuario') !== null;
  },

  // Cerrar sesión
  logout: (): void => {
    localStorage.removeItem('usuario');
  }
};

export default authService;
