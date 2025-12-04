import { Routes } from '@angular/router';

// Guards
import { authGuard } from './core/guards/auth.guard';

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
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: 'home' }
];
