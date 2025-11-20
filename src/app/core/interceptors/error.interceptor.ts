import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { SpringErrorResponse } from '../models/error.model';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      let errorMessage = 'Ocurrió un error inesperado';

      // 1. Error del lado del cliente o red (ej: sin internet)
      if (err.error instanceof ErrorEvent) {
        errorMessage = `Error de cliente: ${err.error.message}`;
      }
      // 2. Error del Servidor (Backend)
      else {
        // Intentamos castear la respuesta a nuestro modelo de Spring
        const backendError = err.error as SpringErrorResponse;

        // Spring Boot a veces pone el mensaje en 'message' y a veces en 'error'
        const serverMessage = backendError?.message || backendError?.error || err.statusText;

        errorMessage = `Error ${err.status}: ${serverMessage}`;

        // --- MANEJO DE ESTADOS HTTP ---

        // 401 Unauthorized: El token expiró o es inválido
        if (err.status === 401) {
          console.warn('Sesión expirada, cerrando sesión...');
          authService.logout(); // Borra token y manda al login
        }

        // 403 Forbidden: No tienes permiso (ej: Pasajero intentando crear viaje)
        if (err.status === 403) {
          console.warn('Acceso denegado');
          // Opcional: Redirigir a home o mostrar un Toast/Alerta
          // router.navigate(['/home']);
        }
      }

      console.error('🛑 Interceptor Error:', errorMessage);

      // Retornamos el error para que el componente también se entere (y muestre una alerta visual)
      return throwError(() => new Error(errorMessage));
    })
  );
};
