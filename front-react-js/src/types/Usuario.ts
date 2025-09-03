import { Persona } from './Persona';

export interface Usuario {
  id: number;
  usuario: string;
  contrasena?: string;
  persona: Persona;
}

export interface LoginRequest {
  usuario: string;
  contrasena: string;
}

export interface LoginResponse {
  success: boolean;
  mensaje: string;
  usuario?: Usuario;
}

export interface ApiResponse<T> {
  success: boolean;
  mensaje: string;
  data?: T;
}

export interface EstadisticasUsuarios {
  totalUsuarios: number;
  usuariosActivos: number;
  usuariosInactivos: number;
}

export interface UsuarioCreateRequest {
  usuario: string;
  contrasena: string;
  personaId: number; // ID de la persona existente
}

export interface UsuarioUpdateRequest {
  usuario: string;
  contrasena?: string;
  personaId?: number; // ID de la persona existente (opcional para actualización)
}
