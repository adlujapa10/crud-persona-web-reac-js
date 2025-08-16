export interface Persona {
  id?: number;
  nombre: string;
  apellido: string;
  cedula: string;
  telefono?: string;
  email?: string;
  edad?: number;
  sexo?: Sexo;
  rol?: string;
}

export enum Sexo {
  M = 'M',
  F = 'F'
}

export interface EstadisticasPersonas {
  totalPersonas: number;
  personasConEmail: number;
  personasConTelefono: number;
  personasConRol: number;
}

export interface ApiResponse<T> {
  success: boolean;
  mensaje?: string;
  data?: T;
  error?: string;
}
