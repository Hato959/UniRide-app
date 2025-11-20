// --- REQUESTS ---
export interface ReservaRequest {
  idViaje: number;
  idPasajero: number;
  metodoPago: 'efectivo' | 'yape' | 'plin';
}

// --- RESPONSES ---
export interface ReservaResponse {
  idViaje: number;
  idPasajero: number;
  estado: string; // 'CONFIRMADA', 'CANCELADA', etc.
}

export interface ReservaListadoResponse {
  idViaje: number;
  idPasajero: number;
  nombrePasajero: string;
  correoPasajero: string;
  estadoReserva: string;
  fechaReserva: string; // ISO DateTime
}
