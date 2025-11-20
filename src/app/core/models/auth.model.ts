// src/app/core/models/auth.model.ts
import { RolActivo } from './enums.model';

// --- REQUESTS ---
export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface RegisterRequest {
  nombre: string;
  correoInstitucional: string;
  contrasena: string;
  carrera: string;
  distrito: string;
  dni: string;
  rolActivo: RolActivo;
}

// DTO específico para registrar solo usuario (si lo usamos separado del RegisterRequest global)
export interface UsuarioRegisterRequest {
  nombre: string;
  correoInstitucional: string;
  contrasena: string;
  carrera?: string;
  distrito?: string;
  dni: string;
}

export interface ValidacionUsuarioRequest {
    usuarioId: number;
    dni: string;
    codigoVerificacion: string;
}

export interface CambiarPasswordRequest {
    contrasenaActual: string;
    nuevaContrasena: string;
}

// --- RESPONSES ---
export interface AuthResponse {
  token: string;
  nombre: string;
  rol: string;
  usuarioId?: number;
  id?: number;
  conductorId?: number;
  pasajeroId?: number;
}
