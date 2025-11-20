// --- REQUESTS ---
export interface PagoRequest {
  idConductor: number;
  idViaje: number;
  idPasajero: number;
  monto: number;
  metodo?: string;
  estado?: string;
}

export interface TarifaSimbolicaRequest {
  conductorId: number;
  vehiculoId: number;
  montoTotal: number;
  numPasajeros: number;
  metodoPago?: string;
  viajeId: number;
}

// --- RESPONSES ---
export interface PagoResponse {
  id: number;
  idConductor: number;
  monto: string; // Viene como String desde tu DTO
  metodo: string;
  estado: string;
  idViaje: number;
  idPasajero: number;
  fecha: string;
}

export interface TarifaSimbolicaResponse {
  id: number;
  montoTotal: number;
  numPasajeros: number;
  conductorId: number;
  vehiculoId: number;
  precioPorPersona: number;
  metodoPago: string;
  fechaCreacion: string;
  viajeId: number;
}
