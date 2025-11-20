import { Routes } from '@angular/router';

export const GUIA_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/guia.component').then(m => m.GuiaComponent)
  }
];
