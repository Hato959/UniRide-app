import { Routes } from '@angular/router';
import { PasajeroProfileComponent } from './pages/pasajero-profile.component';
import { EditProfileComponent } from './pages/edit-profile.component';
import { DriverOnboardingPaso1Component } from './pages/driver-onboarding-paso1.component';
import { VehicleDataComponent } from './pages/vehicle-data.component';
import { ConductorProfileComponent } from './pages/conductor-profile.component';
import { EditConductorProfileComponent } from './pages/edit-conductor-profile.component';
export const PROFILE_ROUTES: Routes = [
  { path: '', redirectTo: 'pasajero', pathMatch: 'full' },
  {
    path: 'pasajero', // Ruta: /perfil/pasajero
    component: PasajeroProfileComponent
  },
  {
    path: 'conductor', // Ruta: /perfil/conductor
    component: ConductorProfileComponent
  },
  {
    path: 'editar/usuario', // Para edición general (Pasajero)
    component: EditProfileComponent
  },
  {
    path: 'editar/conductor', // Para edición triple (Conductor)
    component: EditConductorProfileComponent // ⬅️ ESTA ES LA RUTA OBJETIVO
  },

  // RUTAS DE ONBOARDING (Siempre deben estar dentro del módulo de perfil)
  {
    path: 'registro-licencia', // Ruta: /perfil/registro-licencia
    component: DriverOnboardingPaso1Component
  },
  {
    path: 'registro-vehiculo', // Ruta: /perfil/registro-vehiculo
    component: VehicleDataComponent
  }
];
