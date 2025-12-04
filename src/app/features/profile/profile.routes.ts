import { Routes } from '@angular/router';
import { PasajeroProfileComponent } from './pages/pasajero-profile.component';
import { EditProfileComponent } from './pages/edit-profile.component';
// export const PROFILE_ROUTES: Routes = [
//   {
//     path: '',
//     component: PasajeroProfileComponent
//   },
//   {
//     path: 'editar',
//     component: EditProfileComponent
//   }
// ];

export const PROFILE_ROUTES: Routes = [
  {
    path: 'perfil_usuario',
    loadComponent: () => import('./pages/pasajero-profile.component').then(m => m.PasajeroProfileComponent)
  },
  {
    path: 'editar_perfil_usuario',
    loadComponent: () => import('./pages/edit-profile.component').then(m => m.EditProfileComponent)
  },
  {
    path: 'usuario_viaje',
    loadComponent: () => import('./pages/usuario-viaje.component').then(m => m.UsuarioViajeComponent)
  },
  {
    path: 'buscar_viaje',
    loadComponent: () => import('./pages/buscar-viaje.component').then(m => m.BuscarViajeComponent)
  },
  {
    path: 'conductor_perfil',
    loadComponent: () => import('./pages/conductor-profile.component').then(m => m.ConductorProfileComponent)
  },
  {
    path: 'crear_viaje_conductor',
    loadComponent: () => import('./pages/conductor-crear-viaje.component').then(m => m.ConductorCrearViajeComponent)
  },
  {
    path: 'registro_conductor',
    loadComponent: () => import('./pages/conductor-register.component').then(m => m.ConductorRegisterComponent)
  },
  {
    path: 'registro_vehiculo',
    loadComponent: () => import('./pages/conductor-vehiculo.component').then(m => m.ConductorVehiculoComponent)
  },
  {
    path: 'conductor_viajes',
    loadComponent: () => import('./pages/conductor-viajes.component').then(m => m.ConductorViajesComponent)
  }
];
