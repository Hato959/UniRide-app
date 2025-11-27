import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ValidacionUsuarioRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/validacion`;


  enviarCodigo(correo: string): Observable<string> {
    const params = new HttpParams().set('correo', correo);

    return this.http.post(`${this.apiUrl}/enviar-codigo`, {}, {
      params,
      responseType: 'text'
    });
  }

  verificarUsuario(data: ValidacionUsuarioRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/verificar-usuario`, data, {
      responseType: 'text'
    });
  }
}
