import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ViajeResponse, ViajeRequest } from '../models/trip.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/viajes`;

  // --- SIGNALS (Estado Reactivo) ---
  private _viajes = signal<ViajeResponse[]>([]);
  public viajes = this._viajes.asReadonly();

  // GET - Listar todos (Endpoint: GET /viajes)
  getAll(): Observable<ViajeResponse[]> {
    return this.http.get<ViajeResponse[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(data => this._viajes.set(data))
    );
  }

  //   // GET - Viajes del usuario actual (como pasajero)
  // getUserTrips(): Observable<ViajeResponse[]> {
  //   // Option A: If your API has an endpoint like /viajes/usuario/{id}
  //   const userId = // get from AuthService or StorageService
  //   return this.http.get<ViajeResponse[]>(`${this.apiUrl}/usuario/${userId}`);

  //   // Option B: If your API has an endpoint like /viajes/mis-viajes
  //   return this.http.get<ViajeResponse[]>(`${this.apiUrl}/mis-viajes`);

  //   // Option C: If no specific endpoint exists, filter client-side
  //   return this.getAll().pipe(
  //     map(trips => trips.filter(trip => trip.idConductor === userId))
  //   );
  // }

  // POST - Publicar Viaje (Endpoint: POST /viajes/publicar)
  create(data: ViajeRequest): Observable<ViajeResponse> {
    return this.http.post<ViajeResponse>(`${this.apiUrl}/publicar`, data, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(nuevoViaje => {
        this._viajes.update(current => [...current, nuevoViaje]);
      })
    );
  }

  // GET - Listar viajes (Endpoint: GET /viajes/listar-viajes)
  listarViajes(): Observable<ViajeResponse[]> {
    console.log("entro a `listarViajes()`");
    return this.http.get<ViajeResponse[]>(`${this.apiUrl}/listar-viajes`, {
      headers: this.getAuthHeaders()
    });
  }

  // DELETE - Eliminar (Endpoint: DELETE /viajes/{id})
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
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

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.token();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }
}
