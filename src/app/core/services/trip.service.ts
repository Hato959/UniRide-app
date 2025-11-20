import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ViajeResponse, ViajeRequest } from '../models/trip.model';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/viajes`;

  // --- SIGNALS (Estado Reactivo) ---
  private _viajes = signal<ViajeResponse[]>([]);
  public viajes = this._viajes.asReadonly();

  // GET - Listar todos (Endpoint: GET /viajes)
  getAll(): Observable<ViajeResponse[]> {
    return this.http.get<ViajeResponse[]>(this.apiUrl).pipe(
      tap(data => this._viajes.set(data))
    );
  }

  // POST - Publicar Viaje (Endpoint: POST /viajes/publicar)
  create(data: ViajeRequest): Observable<ViajeResponse> {
    return this.http.post<ViajeResponse>(`${this.apiUrl}/publicar`, data).pipe(
      tap(nuevoViaje => {
        this._viajes.update(current => [...current, nuevoViaje]);
      })
    );
  }

  // DELETE - Eliminar (Endpoint: DELETE /viajes/{id})
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this._viajes.update(current => current.filter(v => v.idViaje !== id));
      })
    );
  }

  // --- BÚSQUEDA (Filtrado en Frontend) ---
  // Como backend no tiene endpoint '/buscar', lo simulamos aquí filtrando la lista actual
  filtrarViajesLocales(origen: string, destino: string, fecha: string): void {
    this.getAll().subscribe(todos => {
      const filtrados = todos.filter(v => {
        const matchOrigen = !origen || v.origen.toLowerCase().includes(origen.toLowerCase());
        const matchDestino = !destino || v.destino.toLowerCase().includes(destino.toLowerCase());
        // La fecha viene como string 'YYYY-MM-DD' en tu ViajeResponseDTO
        const matchFecha = !fecha || v.fecha === fecha;

        return matchOrigen && matchDestino && matchFecha;
      });

      // Actualizamos el signal con solo los resultados
      this._viajes.set(filtrados);
    });
  }
}
