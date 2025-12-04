import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.model';
import { StorageService } from './storage.service';
import { UserService } from './user.service';

// 1. ACTUALIZAR LA INTERFAZ DE SESION
export interface UserSession {
  nombre: string;
  rol: string;
  token: string;
  usuarioId: number;
  conductorId?: number;
  pasajeroId?: number;
  verificado?: boolean;
  correoInstitucional: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);
  private router = inject(Router);
  private userService = inject(UserService);
  private apiUrl = `${environment.apiUrl}/auth`;

  // Signals
  private _currentUser = signal<UserSession | null>(null);
  private _isAuthenticated = signal<boolean>(false);
  private _token = signal<string | null>(null);

  currentUser = this._currentUser.asReadonly();
  isAuthenticated = this._isAuthenticated.asReadonly();
  token = this._token.asReadonly();

  constructor() {
    this.loadAuthData();
  }

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      // 1. Guardamos datos basicos del login
      tap(response => this.saveAuthData(response)),

      // 2. Encadenamos una llamada al perfil para saber si esta verificado
      switchMap(response => {
        return this.userService.getProfile(response.usuarioId);
      }),

      // 3. Con la info del perfil, decidimos donde ir
      tap(perfil => {
        // Actualizamos la sesion con el estado de verificado
        this.updateVerificationStatus(perfil.verificado);

        if (!perfil.verificado) {
          this.router.navigate(['/auth/validation']);
          return;
        }

        // RedirecciA3n segAon el rol
        switch (perfil.rol) {
          case 'CONDUCTOR':
            this.router.navigate(['/perfil', 'conductor_perfil']);
            break;
          case 'PASAJERO':
            this.router.navigate(['/perfil', 'perfil_usuario']);
            break;
          default:
            this.router.navigate(['/home']);
        }
      })
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(response => {
        this.saveAuthData(response);
        // un usuario recien registrado no esta verificado
        this.updateVerificationStatus(false);
        this.router.navigate(['/auth/validation']);
      })
    );
  }

  logout(): void {
    this.storage.clear();
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
    this._token.set(null);
    this.router.navigate(['/auth/login']);
  }

  // 2. ACTUALIZAR COMO GUARDAMOS LOS DATOS
  private saveAuthData(response: AuthResponse): void {
    this.storage.setItem('token', response.token);
    this._token.set(response.token);

    // Mapeamos la respuesta del backend a nuestra sesión local
    const session: UserSession = {
      nombre: response.nombre,
      rol: response.rol,
      token: response.token,
      usuarioId: response.usuarioId,
      conductorId: response.conductorId,
      pasajeroId: response.pasajeroId,
      verificado: false,
      correoInstitucional: response.correoInstitucional
    };

    this.storage.setItem('user_session', session);
    this._currentUser.set(session);
    this._isAuthenticated.set(true);
  }

  private updateVerificationStatus(status: boolean) {
    const current = this._currentUser();
    if (current) {
      const updated = { ...current, verificado: status };
      this.storage.setItem('user_session', updated);
      this._currentUser.set(updated);
    }
  }

  private loadAuthData(): void {
    const token = this.storage.getItem<string>('token');
    const session = this.storage.getItem<UserSession>('user_session');

    if (token && session) {
      this._token.set(token);
      this._currentUser.set(session);
      this._isAuthenticated.set(true);
    }
  }

  public updatePasajeroId(newId: number): void {
    const current = this._currentUser();
    if (current) {
        const updated = { ...current, pasajeroId: newId };
        this.storage.setItem('user_session', updated);
        this._currentUser.set(updated);
    }
  }

  // 3. GETTERS ÚTILES
  get currentEmail(): string | undefined {
    return this._currentUser()?.correoInstitucional;
  }
  get currentUsuarioId(): number | undefined { return this._currentUser()?.usuarioId; }
  get currentConductorId(): number | undefined { return this._currentUser()?.conductorId; }
  get currentPasajeroId(): number | undefined { return this._currentUser()?.pasajeroId; }
  get isConductor(): boolean { return this._currentUser()?.rol === 'CONDUCTOR'; }
  get isPasajero(): boolean { return this._currentUser()?.rol === 'PASAJERO'; }
  get isAdmin(): boolean { return this._currentUser()?.rol === 'ADMIN'; }
  get isVerified(): boolean { return this._currentUser()?.verificado ?? false; }
}
