import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ReservaRequest, ReservaResponse, ReservaListadoResponse } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/reservas`;

  private _misReservas = signal<ReservaListadoResponse[]>([]);
  public misReservas = this._misReservas.asReadonly();

  // POST - Reservar
  // Backend: ReservaController @PostMapping -> /reservas (Correcto)
  crearReserva(data: ReservaRequest): Observable<ReservaResponse> {
    return this.http.post<ReservaResponse>(this.apiUrl, data);
  }

  // GET - Ver mis reservas
  //@GetMapping("/pasajero/{id}")
  getReservasPasajero(pasajeroId: number): Observable<ReservaListadoResponse[]> {
    return this.http.get<ReservaListadoResponse[]>(`${this.apiUrl}/pasajero/${pasajeroId}`).pipe(
      tap(data => this._misReservas.set(data))
    );
  }

  // DELETE - Cancelar reserva
  // Backend: ReservaController @DeleteMapping -> requiere params idViaje y idPasajero
  cancelarReserva(idViaje: number, idPasajero: number): Observable<string> {
    const params = new HttpParams()
      .set('idViaje', idViaje)
      .set('idPasajero', idPasajero);

    // Nota: Tu backend devuelve String ("Reserva cancelada."), usamos responseType: 'text'
    return this.http.delete(`${this.apiUrl}`, { params, responseType: 'text' });
  }
}
