import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResenaRequest, EventoRequest, EventoResponse, ResenaResponse } from '../models/interaction.model';
import { PagoRequest, PagoResponse } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`;

  // --- EVENTOS ---
  // Backend: EventoController @PostMapping("/registrar") -> /eventos/registrar
  registrarEvento(data: EventoRequest): Observable<EventoResponse> {
    return this.http.post<EventoResponse>(`${this.apiUrl}/eventos/registrar`, data);
  }

  // --- PAGOS ---
  // Backend: PagoController @PostMapping("/crear") -> /pagos/crear
  realizarPago(data: PagoRequest): Observable<PagoResponse> {
    return this.http.post<PagoResponse>(`${this.apiUrl}/pagos/crear`, data);
  }

  // --- RESEÑAS ---
  // Backend: ResenaController @PostMapping -> /resenas (Correcto)
  crearResena(data: ResenaRequest): Observable<ResenaResponse> {
    return this.http.post<ResenaResponse>(`${this.apiUrl}/resenas`, data);
  }
}
