import { EventoTipo } from './enums.model';

// --- REQUESTS ---
export interface ResenaRequest {
  viajeId: number;
  autorId: number;
  destinatarioId: number;
  calificacion: number;
  comentario: string;
}

export interface EventoRequest {
  viajeId: number;
  conductorId: number;
  pasajeroId: number;
  tipo: EventoTipo;
  descripcion: string;
}

export interface NotificacionPreferenciasRequest {
    inAppEnabled: boolean;
    emailEnabled: boolean;
    reminderMinutesBefore: number;
}

// --- RESPONSES ---
export interface ResenaResponse {
  id: number;
  viajeId: number;
  autorId: number;
  destinatarioId: number;
  calificacion: number;
  comentario: string;
}

export interface EventoResponse {
  id: number;
  viajeId: number;
  conductorId: number;
  pasajeroId: number;
  tipo: EventoTipo;
  descripcion: string;
  fechaHora: string;
  activo: boolean;
}

export interface NotificacionPreferenciasResponse {
    inAppEnabled: boolean;
    emailEnabled: boolean;
    reminderMinutesBefore: number;
}
