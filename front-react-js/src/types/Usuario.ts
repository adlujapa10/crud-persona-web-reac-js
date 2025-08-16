export interface Usuario {
  id: number;
  usuario: string;
  nombreCompleto: string;
  email?: string;
  rol?: string;
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
