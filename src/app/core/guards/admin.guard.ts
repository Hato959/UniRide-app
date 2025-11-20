import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Usamos el nuevo getter 'isAdmin'
  if (authService.isAuthenticated() && authService.isAdmin) {
    return true;
  }

  // Si no es admin, lo mandamos al Home (o a una página de error 403)
  router.navigate(['/home']);
  return false;
};
