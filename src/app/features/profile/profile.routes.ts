import { Routes } from '@angular/router';
import { PasajeroProfileComponent } from './pages/pasajero-profile.component';
import { EditProfileComponent } from './pages/edit-profile.component';
export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    component: PasajeroProfileComponent
  },
  {
    path: 'editar',
    component: EditProfileComponent
  }
];
