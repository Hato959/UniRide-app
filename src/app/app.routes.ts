import { Routes } from '@angular/router';
import { TripStatusComponent } from './features/trip-status/trip-status';
import { PasengerVizComponent } from './features/pasenger-viz/pasenger-viz';
import { DriverVizComponent } from './features/driver-viz/driver-viz';

export const routes: Routes = [
  { path: 'trip', component: TripStatusComponent },
  { path: 'pasenger-viz', component: PasengerVizComponent },
  { path: 'driver-viz', component: DriverVizComponent },
  { path: '', redirectTo: 'driver-viz', pathMatch: 'full' },
];
