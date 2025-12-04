import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NavbarUserComponent } from './../../../shared/components/navbar-user.component';
import { AuthService } from './../../../core/services/auth.service';

@Component({
  selector: 'app-conductor-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarUserComponent],
  templateUrl: '../../../core/static/conductor-profile-component/conductor-profile.component.html',
  styleUrl: '../../../core/static/conductor-profile-component/conductor-profile.component.css'
})
export class ConductorProfileComponent {
  constructor(private router: Router, private authService: AuthService) {}

  get driverName(): string {
    return this.authService.currentUser()?.nombre ?? 'Conductor';
  }

  goToCrearViaje(): void {
    this.router.navigate(['/driver_home', 'crear_viaje_conductor']);
  }

  goToRegistroConductor(): void {
    this.router.navigate(['/driver_home', 'registro_conductor']);
  }

  goToRegistroVehiculo(): void {
    this.router.navigate(['/driver_home', 'registro_vehiculo']);
  }

  goToViajes(): void {
    this.router.navigate(['/driver_home', 'conductor_viajes']);
  }
}
