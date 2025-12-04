import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ConductorRegisterRequest, VehiculoRegisterRequest, VehiculoResponse, ConductorResponse } from '../models/driver.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  // Usamos la raíz para poder navegar entre /conductores y /vehiculos
  private baseUrl = `${environment.apiUrl}`;

  private _vehiculos = signal<VehiculoResponse[]>([]);
  public vehiculos = this._vehiculos.asReadonly();

  // POST - Registrar Conductor
  // Backend: ConductorController @PostMapping("/registro")
  registrarConductor(data: ConductorRegisterRequest): Observable<ConductorResponse> {
    return this.http.post<ConductorResponse>(`${this.baseUrl}/conductores/registro`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // GET - Obtener conductor por usuarioId
  obtenerConductorPorUsuario(usuarioId: number): Observable<ConductorResponse> {
    return this.http.get<ConductorResponse>(`${this.baseUrl}/conductores/${usuarioId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // POST - Registrar Vehículo
  // Backend: VehiculoController @RequestMapping("/vehiculos") + @PostMapping("/registro")
  registrarVehiculo(data: VehiculoRegisterRequest): Observable<VehiculoResponse> {
    return this.http.post<VehiculoResponse>(`${this.baseUrl}/vehiculos/registro`, data, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(vehiculo => {
        this._vehiculos.update(current => [...current, vehiculo]);
      })
    );
  }

  // GET - Mis Vehículos
  // Backend: VehiculoController @GetMapping("/conductor/{conductorId}")
  getMisVehiculos(conductorId: number): Observable<VehiculoResponse[]> {
    return this.http.get<VehiculoResponse[]>(`${this.baseUrl}/vehiculos/conductor/${conductorId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(data => this._vehiculos.set(data))
    );
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.token();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }
}
