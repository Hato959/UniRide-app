import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PasajeroRequest, PasajeroResponse } from '../models/passenger.model';

@Injectable({
  providedIn: 'root'
})
export class PasajeroService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/pasajeros`;

  obtener(pasajeroId: number): Observable<PasajeroResponse> {
    return this.http.get<PasajeroResponse>(`${this.apiUrl}/${pasajeroId}`);
  }

  registrar(data: PasajeroRequest): Observable<PasajeroResponse> {
    return this.http.post<PasajeroResponse>(this.apiUrl, data);
  }

  actualizar(pasajeroId: number, data: PasajeroRequest): Observable<PasajeroResponse> {
    return this.http.put<PasajeroResponse>(`${this.apiUrl}/${pasajeroId}`, data);
  }
}
