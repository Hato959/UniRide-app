import { inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { DriverService } from '../services/driver.service';

export const driverOnboardingGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const driverService = inject(DriverService);
  const currentUrl = state.url;

  // 1. Si no es Conductor, lo dejamos pasar inmediatamente.
  if (!authService.isConductor) {
    return of(true);
  }

  const conductorId = authService.currentConductorId;

  // ======================================
  // PASO 1: Verificar ID de Conductor (Licencia)
  // ======================================
  if (!conductorId) {
    const paso1Url = '/perfil/registro-licencia';

    // Si falta el ID, redirigir al paso 1, A MENOS que ya estemos ahí.
    if (currentUrl.includes(paso1Url)) {
      return of(true);
    }

    // Redirigir al PASO 1
    return of(router.createUrlTree([paso1Url]));
  }

  // ======================================
  // PASO 2: Verificar Vehículo (Lógica Asíncrona)
  // ======================================

  // Si el conductorId existe, comprobamos si tiene vehículos registrados
  // Usamos switchMap para realizar la llamada al servicio
  return driverService.getMisVehiculos(conductorId).pipe(
    map(vehicles => {
      const hasVehicle = vehicles && vehicles.length > 0;
      const paso2Url = '/perfil/registro-vehiculo';

      if (!hasVehicle) {
        // Si falta el vehículo, redirigir al paso 2, A MENOS que ya estemos ahí.
        if (currentUrl.includes(paso2Url)) {
          return true; // Ya en el paso 2, permitir acceso.
        }

        // Redirigir al PASO 2
        return router.createUrlTree([paso2Url]);
      }

      // Si tiene ID de Conductor Y Vehículo: ACCESO CONCEDIDO (true)
      return true;
    }),
    catchError(() => {
      // En caso de error de red o API, asumimos que no tiene vehículos y lo enviamos al paso 2
      // para que lo intente de nuevo.
      return of(router.createUrlTree(['/perfil/registro-vehiculo']));
    })
  );
};
