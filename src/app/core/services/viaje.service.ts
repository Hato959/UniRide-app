import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Viaje } from '../models/viaje.model';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {

  // Ajusta según tu environment o configuración global
  private baseUrl = 'http://localhost:8080/api/v1/viajes';

  constructor(private http: HttpClient) {}

  listarViajes(): Observable<Viaje[]> {
    return this.http.get<Viaje[]>(this.baseUrl);
  }

  obtenerViajePorId(idViaje: number): Observable<Viaje> {
    return this.http.get<Viaje>(`${this.baseUrl}/${idViaje}`);
  }

  crearViaje(payload: Partial<Viaje>): Observable<Viaje> {
    return this.http.post<Viaje>(this.baseUrl, payload);
  }
}
