import { Routes } from '@angular/router';
import { ViajesComponent } from './pages/viajes.component';
import { ViajeDetalleComponent } from './pages/viaje-detalle.component';

export const CONDUCTOR_ROUTES: Routes = [
  {
    path: '',
    component: ViajesComponent
  },
  {
    path: ':id',
    component: ViajeDetalleComponent
  }
];
