import { Routes } from '@angular/router';

export const NOSOTROS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/nosotros.component').then(m => m.NosotrosComponent)
  }
];
