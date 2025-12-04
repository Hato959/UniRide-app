export type TipoEventoViaje = 'INICIO_VIAJE' | 'RECOGIO_PASAJERO' | 'TERMINO_VIAJE';

export interface EventoViaje {
  id?: number;
  viajeId: number;
  conductorId?: number;
  pasajeroId?: number | null;
  tipo: TipoEventoViaje;
  fechaHora?: string;
  descripcion?: string;
  activo?: boolean;
}
