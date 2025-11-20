import { Routes } from '@angular/router';

export const DRIVER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/driver-info.component').then(m => m.DriverInfoComponent)
  }
];
