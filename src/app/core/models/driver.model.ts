// --- REQUESTS ---
export interface ConductorRegisterRequest {
  usuarioId: number;
  licenciaConducir: string;
  experienciaAnios: number;
}

export interface VehiculoRegisterRequest {
  conductorId: number;
  marca: string;
  placa: string;
  modelo: string;
  color: string;
}

// --- RESPONSES ---
export interface ConductorResponse {
  id: number;
  usuarioId: number;
  licenciaConducir: string;
  experienciaAnios: number;
}

export interface ConductorInfoResponse {
  id: number;
  usuarioId: number;
  usuarioNombre: string;
  usuarioCorreoInstitucional: string;
  carrera: string;
  distrito: string;
  dni: string;
  licenciaConducir: string;
  experienciaAnios: number;
}

export interface VehiculoResponse {
  id: number;
  conductorId: number;
  marca: string;
  placa: string;
  modelo: string;
  color: string;
  fotoVehiculoUrl?: string;
}
