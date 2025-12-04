import { Routes } from '@angular/router';
import { TripStatusComponent } from './features/trip-status/trip-status';
import { PasengerVizComponent } from './features/pasenger-viz/pasenger-viz';
import { DriverVizComponent } from './features/driver-viz/driver-viz';


// Guards
import { authGuard } from './core/guards/auth.guard';
import { driverOnboardingGuard } from './core/guards/driver-onboarding.guard';
import { roleGuard } from './core/guards/role.guard';
import { RolActivo } from './core/models/enums.model';

// Layouts
import { LandingLayoutComponent } from './shared/layouts/landing-layout';
import { AuthLayoutComponent } from './shared/layouts/auth-layout';

export const routes: Routes = [
  // 2. ZONA DE AUTENTICACIÓN (Sin Layout compartido)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },

  {
    path: 'user_home',
    loadChildren: () => import('./features/profile/profile.routes').then(m => m.PROFILE_ROUTES)
  },
  {
    path: 'driver_home',
    loadChildren: () => import('./features/profile/profile.routes').then(m => m.PROFILE_ROUTES)
  },

  // 3. ZONA PRIVADA / APP INTERNA (Auth Layout)
  // {
  //   path: '',
  //   component: AuthLayoutComponent, // Este tiene el NavbarUser (con menú de conductor/pasajero)
  //   canActivate: [authGuard],       // Protege todas las rutas hijas
  //   children: [
  //     {
  //         path: 'perfil',
  //         loadChildren: () => import('./features/profile/profile.routes').then(m => m.PROFILE_ROUTES)
  //     },
  //     { path: '', redirectTo: 'home', pathMatch: 'full' }
  //   ]
  // },

  // 1. ZONA PÚBLICA (Landing Layout)
  {
    path: '',
    component: LandingLayoutComponent,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./features/home/home.routes').then(m => m.HOME_ROUTES)
      },
      {
        path: 'nosotros',
        loadChildren: () => import('./features/home/nosotros.routes').then(m => m.NOSOTROS_ROUTES)
      },
      {
        path: 'guia',
        loadChildren: () => import('./features/home/guia.routes').then(m => m.GUIA_ROUTES)
      }
    ]
  },

  // 2. ZONA DE AUTENTICACIÓN (Sin Layout compartido)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },

  // 3. ZONA PRIVADA/OBLIGATORIA (Rutas de Onboarding y Edición)
  // Rutas que solo requieren estar autenticadas, pero no necesariamente "Completas"
  {
    path: 'perfil',
    component: AuthLayoutComponent,
    canActivate: [authGuard, driverOnboardingGuard],
    children: [

        {
             path: 'pasajero', // /perfil/pasajero
             data: { expectedRole: 'PASAJERO' as RolActivo }, // Definimos el rol esperado
             canActivate: [roleGuard], // ⬅️ APLICAMOS RoleGuard
             loadComponent: () => import('./features/profile/pages/pasajero-profile.component').then(m => m.PasajeroProfileComponent)
        },
        {
             path: 'conductor', // /perfil/conductor
             data: { expectedRole: 'CONDUCTOR' as RolActivo }, // Definimos el rol esperado
             canActivate: [roleGuard], // ⬅️ APLICAMOS RoleGuard
             loadComponent: () => import('./features/profile/pages/conductor-profile.component').then(m => m.ConductorProfileComponent)
        },

        // Rutas de Edición (Dejamos solo la edición de datos personales)
        {
            path: 'editar', // /perfil/editar
            loadComponent: () => import('./features/profile/pages/edit-profile.component').then(m => m.EditProfileComponent)
        },
        // ... (Rutas de Onboarding y Edición Conductor)
        {
            path: 'registro-licencia',
            loadComponent: () => import('./features/profile/pages/driver-onboarding-paso1.component').then(m => m.DriverOnboardingPaso1Component)
        },
        {
            path: 'registro-vehiculo',
            loadComponent: () => import('./features/profile/pages/vehicle-data.component').then(m => m.VehicleDataComponent)
        },

        // Rutas de Edición Específica (Para conductor)
        {
            path: 'editar/conductor',
            canActivate: [roleGuard], // ⬅️ Aplicamos RoleGuard a la edición de conductor
            data: { expectedRole: 'CONDUCTOR' as RolActivo },
            loadComponent: () => import('./features/profile/pages/edit-conductor-profile.component').then(m => m.EditConductorProfileComponent)
        },

        // Redirección por defecto dentro de /perfil
        { path: '', redirectTo: 'pasajero', pathMatch: 'full' }
    ]
  },

  // 4. ZONA INTERNA PRINCIPAL - [SIN CAMBIOS RELEVANTES]
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [authGuard, driverOnboardingGuard],
    children: [
        { path: '', redirectTo: 'perfil/pasajero', pathMatch: 'full' },
        {
            path: 'home',
            loadChildren: () => import('./features/home/home.routes').then(m => m.HOME_ROUTES)
        },
        // 🆕 Ruta de Fallback para Cambio de Rol (Si usas el botón Cambiar Rol)
        { path: 'rol/cambiar', redirectTo: 'perfil/pasajero' }
    ]
  },

  { path: '**', redirectTo: 'home' }
];
