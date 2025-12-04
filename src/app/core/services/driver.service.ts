import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ConductorRegisterRequest, VehiculoRegisterRequest, VehiculoResponse, ConductorResponse, ConductorInfoResponse } from '../models/driver.model';

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

  obtenerPerfil(usuarioId: number): Observable<ConductorResponse> {
    return this.http.get<ConductorResponse>(`${this.baseUrl}/conductores/${usuarioId}`);
  }

  actualizarConductor(usuarioId: number, data: ConductorRegisterRequest): Observable<ConductorResponse> {
    // Nota: Reutilizamos ConductorRegisterRequest (licencia, experiencia, usuarioId) para el PUT
    return this.http.put<ConductorResponse>(`${this.baseUrl}/conductores/${usuarioId}`, data);
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
  actualizarVehiculo(vehiculoId: number, data: VehiculoRegisterRequest): Observable<VehiculoResponse> {
    return this.http.put<VehiculoResponse>(`${this.baseUrl}/vehiculos/${vehiculoId}`, data).pipe(
      tap(updatedVehiculo => {
        // Opcional: Actualizar el signal de vehículos localmente
        this._vehiculos.update(current =>
          current.map(v => v.id === vehiculoId ? updatedVehiculo : v)
        );
      })
    );
  }
  subirFotoVehiculo(vehiculoId: number, file: File): Observable<VehiculoResponse> {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);

        return this.http.post<VehiculoResponse>(
            `${this.baseUrl}/vehiculos/${vehiculoId}/foto`,
            formData
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
