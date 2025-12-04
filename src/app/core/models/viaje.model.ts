export interface Viaje {
  idViaje: number;
  origen: string;
  destino: string;
  fechaSalida?: string;
  horaSalida?: string;
  asientosDisponibles?: number;
  precio?: number;
  // Estado general del viaje (depende de cómo lo mande el backend)
  estado?: 'PENDIENTE' | 'EN_CURSO' | 'FINALIZADO' | string;
}
