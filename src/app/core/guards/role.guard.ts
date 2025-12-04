import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RolActivo } from '../models/enums.model';
import { Observable } from 'rxjs';

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRole: RolActivo = route.data['expectedRole'];

  if (authService.isAdmin) {
    return true;
  }

  if (authService.currentUser()?.rol === expectedRole) {
    return true;
  }

  const currentRol = authService.currentUser()?.rol;

  if (currentRol === 'CONDUCTOR') {
    return router.createUrlTree(['/perfil/conductor']);
  } else if (currentRol === 'PASAJERO') {
    return router.createUrlTree(['/perfil/pasajero']);
  }

  return router.createUrlTree(['/home']);
};
