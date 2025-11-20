import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UsuarioResponse } from '../models/user.model';
import { ValidacionUsuarioRequest, CambiarPasswordRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  // Usamos la raíz de la API para poder movernos entre controladores (/usuarios, /validacion)
  private baseUrl = `${environment.apiUrl}`;

  // Signal para el perfil del usuario actual
  private _userProfile = signal<UsuarioResponse | null>(null);
  public userProfile = this._userProfile.asReadonly();

  // GET - Obtener mi perfil completo
  // Backend: @GetMapping("/{id}") en UsuarioController
  getProfile(id: number): Observable<UsuarioResponse> {
    return this.http.get<UsuarioResponse>(`${this.baseUrl}/usuarios/${id}`).pipe(
      tap(profile => this._userProfile.set(profile))
    );
  }

  // POST - Validar cuenta
  // Backend: @PostMapping("/verificar-usuario") en ValidacionController (Ruta: /validacion/verificar-usuario)
  validarCuenta(data: ValidacionUsuarioRequest): Observable<string> {
    return this.http.post(`${this.baseUrl}/validacion/verificar-usuario`, data, { responseType: 'text' });
  }

  // PUT - Cambiar contraseña
  // Backend: @PutMapping("/{id}/cambiar-password") en UsuarioController
  cambiarPassword(id: number, data: CambiarPasswordRequest): Observable<string> {
    return this.http.put(`${this.baseUrl}/usuarios/${id}/cambiar-password`, data, { responseType: 'text' });
  }

  // PUT - Cambiar Rol Activo
  // Backend: @PutMapping("/{id}/cambiar-rol") con @RequestParam
  cambiarRol(id: number, nuevoRol: 'CONDUCTOR' | 'PASAJERO'): Observable<string> {
    const params = new HttpParams().set('nuevoRol', nuevoRol);

    return this.http.put(
      `${this.baseUrl}/usuarios/${id}/cambiar-rol`,
      {},
      { params, responseType: 'text' }
    );
  }

  // GET - Obtener Rol Activo
  // Backend: @GetMapping("/{id}/rol-activo")
  obtenerRolActivo(id: number): Observable<string> {
    return this.http.get(
      `${this.baseUrl}/usuarios/${id}/rol-activo`,
      { responseType: 'text' }
    );
  }
}
