import { DiaSemana } from './enums.model';

// --- REQUESTS ---
export interface ViajeRequest {
  idConductor: number;
  origen: string;
  destino: string;
  fecha: string; // Formato ISO 'YYYY-MM-DD'
  hora: string;  // Formato 'HH:mm:ss'
  asientosDisponibles: number;
  recurrente?: boolean;
  fechaFinRecurrencia?: string;
  diasRecurrencia?: DiaSemana[];
}

export interface ViajeRecurrenteRequest {
  idConductor: number;
  origen: string;
  destino: string;
  fechaInicio: string; // 'YYYY-MM-DD'
  hora: string;
  asientosDisponibles: number;
  frecuencia: 'DIARIA' | 'SEMANAL';
  repeticiones?: number;
}

// --- RESPONSES ---
export interface ViajeResponse {
  idViaje: number;
  idConductor: number;
  nombreConductor: string;
  origen: string;
  destino: string;
  fecha: string;
  hora: string;
  asientosDisponibles: number;
  recurrente: boolean;
  fechaFinRecurrencia?: string;
  diasRecurrencia?: DiaSemana[];
}

export interface ViajeRecurrenteResponse {
  mensaje: string;
  totalCreados: number;
  idsViajesCreados: number[];
}
