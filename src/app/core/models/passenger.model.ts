// --- REQUESTS ---
export interface PasajeroRequest {
  usuarioId: number;
  preferencias?: string;
}

// --- RESPONSES ---
export interface PasajeroResponse {
  id: number;
  usuarioId: number;
  nombreUsuario: string;
  correo: string;
  preferencias: string;
}
