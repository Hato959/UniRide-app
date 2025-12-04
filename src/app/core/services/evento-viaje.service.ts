import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventoViaje, TipoEventoViaje } from '../models/evento-viaje.model';

@Injectable({
  providedIn: 'root'
})
export class EventoViajeService {

  private baseUrl = 'http://localhost:8080/api/v1/eventos';

  constructor(private http: HttpClient) {}

  /**
   * Devuelve todos los eventos asociados a un viaje.
   * GET /api/v1/eventos/viaje/{viajeId}
   */
  obtenerEventos(viajeId: number): Observable<EventoViaje[]> {
    return this.http.get<EventoViaje[]>(`${this.baseUrl}/viaje/${viajeId}`);
  }

  /**
   * Registra un evento de viaje.
   * POST /api/v1/eventos/registrar
   *
   * El backend que ya tienes funcionando espera algo como:
   * { viajeId, conductorId, pasajeroId, tipo, descripcion }
   */
  crearEvento(
    viajeId: number,
    tipo: TipoEventoViaje,
    conductorId: number,
    pasajeroId: number | null,
    descripcion: string
  ): Observable<EventoViaje> {
    const body = { viajeId, conductorId, pasajeroId, tipo, descripcion };
    return this.http.post<EventoViaje>(`${this.baseUrl}/registrar`, body);
  }
}
