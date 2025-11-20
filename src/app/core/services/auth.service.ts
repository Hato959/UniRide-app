import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.model';
import { StorageService } from './storage.service';

// 1. ACTUALIZAR LA INTERFAZ DE SESION
export interface UserSession {
  nombre: string;
  rol: string;
  token: string;
  // Nuevos campos para guardar en memoria
  usuarioId?: number;
  id?: number;
  conductorId?: number;
  pasajeroId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);
  private router = inject(Router);
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

  // LOGIN (Sin cambios en la firma, solo procesa diferente)
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.saveAuthData(response);
        this.router.navigate(['/perfil']);
      })
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(response => {
        this.saveAuthData(response);
        this.router.navigate(['/perfil']);
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

    const userId = response.usuarioId ?? response.id;

    // Mapeamos la respuesta del backend a nuestra sesion local
    const session: UserSession = {
      nombre: response.nombre,
      rol: response.rol,
      token: response.token,
      usuarioId: userId,
      id: userId,
      conductorId: response.conductorId,
      pasajeroId: response.pasajeroId
    };

    this.storage.setItem('user_session', session);
    this._currentUser.set(session);
    this._isAuthenticated.set(true);
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

  // 3. GETTERS UTILES
  get currentUsuarioId(): number | undefined {
    return this._currentUser()?.usuarioId ?? (this._currentUser() as any)?.id;
  }

  get currentConductorId(): number | undefined {
    return this._currentUser()?.conductorId;
  }

  get currentPasajeroId(): number | undefined {
    return this._currentUser()?.pasajeroId;
  }

  get isConductor(): boolean {
    return this._currentUser()?.rol === 'CONDUCTOR';
  }

  get isPasajero(): boolean {
    return this._currentUser()?.rol === 'PASAJERO';
  }

  get isAdmin(): boolean {
    return this._currentUser()?.rol === 'ADMIN';
  }
}