import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './../../../core/services/auth.service';
import { UserService } from './../../../core/services/user.service';
import { DriverService } from './../../../core/services/driver.service';
import { UsuarioResponse } from './../../../core/models/user.model';
import { ConductorResponse, VehiculoResponse } from './../../../core/models/driver.model';
import { PasajeroService } from './../../../core/services/passenger.service';

@Component({
  selector: 'app-conductor-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: '../../../core/static/conductor-profile-component/conductor-profile.component.html',
  styleUrl: '../../../core/static/pasajero-profile-component/pasajero-profile.component.css',
  styles: [`
    :host {
        --primary-red: #D50100;
        --bg-gray: #BFBFBF;
        display: block;
        background-color: var(--bg-gray);
        min-height: 100%;
    }
    .profile-container { max-width: 1100px; }

    .actions-top-bar {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      margin-bottom: 30px;
    }
    .btn-change-role { justify-self: start; background-color: #333; }
    .btn-change-role:hover { background-color: #555; }
    .btn-edit-profile { justify-self: end; }
    .title-main { margin: 0; text-align: center; }

    .profile-cards-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      grid-template-rows: auto 1fr;
    }

    .profile-info { grid-row: 1 / 3; }
    .vehicle-card { grid-row: 1 / 2; }
    .hours-card { grid-row: 2 / 3; }

    .user-data-wrapper { display: flex; gap: 20px; align-items: flex-start; }
    .license-info { margin-top: 15px; padding-top: 10px; border-top: 1px solid #eee; }

    .vehicle-details { display: flex; gap: 20px; align-items: flex-start; margin-bottom: 20px; }
    .vehicle-img-container { min-width: 120px; }
    .vehicle-photo { width: 120px; height: 80px; object-fit: cover; border-radius: 5px; }
    .vehicle-info-text { font-size: 0.95rem; }
    .vehicle-actions { text-align: right; }
    .btn-edit-vehicle { background-color: #eee; color: var(--primary-red); border: 1px solid var(--primary-red); padding: 8px 15px; border-radius: 5px; font-weight: 600; cursor: pointer; transition: background-color 0.2s; }
    .btn-edit-vehicle:hover { background-color: var(--primary-red); color: white; }

    .hours-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }
    .btn-secondary {
        background-color: #eee;
        color: #555;
        border-color: #ccc;
    }
    @media (max-width: 900px) {
        .profile-cards-grid {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
        }
        .profile-info { grid-row: auto; }
        .vehicle-card { grid-row: auto; }
        .hours-card { grid-row: auto; }
        .actions-top-bar { grid-template-columns: 1fr 2fr 1fr; }
        .title-main { grid-column: 2; }
    }
    :host {
  --primary-red: #D50100;
  --bg-gray: #f8f9fa;
  display: block;
  background: var(--bg-gray);
  min-height: 100vh;
}

.profile-layout {
  padding: 30px 20px;
}

.profile-container {
  max-width: 1100px;
  margin: 0 auto;
}

.title-main {
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
}

.driver-name {
  margin: 0 0 20px;
  color: #555;
  font-weight: 600;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card h3 {
  margin: 0;
  color: var(--primary-red);
}

.card p {
  margin: 0;
  color: #555;
}

.highlight {
  border: 1px solid var(--primary-red);
}

.btn-primary,
.btn-secondary {
  border: none;
  border-radius: 8px;
  padding: 10px 14px;
  cursor: pointer;
  font-weight: 700;
  transition: background-color 0.2s, color 0.2s;
  text-decoration: none;
  text-align: center;
}

.btn-primary {
  background: var(--primary-red);
  color: #fff;
}

.btn-primary:hover {
  background: #b00000;
}

.btn-secondary {
  background: #eee;
  color: var(--primary-red);
}

.btn-secondary:hover {
  background: var(--primary-red);
  color: #fff;
}
  `]
})
export class ConductorProfileComponent implements OnInit {

  usuario = signal<UsuarioResponse | null>(null);
  conductor = signal<ConductorResponse | null>(null);
  vehiculo = signal<VehiculoResponse | null>(null);
  isLoading = signal(true);

  authService = inject(AuthService);
  private userService = inject(UserService);
  private driverService = inject(DriverService);

  ngOnInit(): void {
    this.loadProfileData();
  }

  getInitialLetter(): string {
    const name = this.usuario()?.nombre;
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  loadProfileData(): void {
    const usuarioId = this.authService.currentUsuarioId;
    const conductorId = this.authService.currentConductorId;

    if (!usuarioId) {
      console.error('No se pudo obtener el ID del usuario.');
      this.isLoading.set(false);
      return;
    }


    this.userService.getProfile(usuarioId).subscribe({
      next: (user: UsuarioResponse) => {
        this.usuario.set(user);
      },
      error: (err) => {
        console.error('Error al cargar perfil de usuario:', err);
      }
    });


    if (conductorId) {
      this.driverService.obtenerPerfil(usuarioId).subscribe({
        next: (driver: ConductorResponse) => {
            this.conductor.set(driver);
        },
        error: (err) => console.error('Error al cargar perfil de conductor:', err),
      });


      this.driverService.getMisVehiculos(conductorId).subscribe({
        next: (vehicles: VehiculoResponse[]) => {
            if (vehicles.length > 0) {
                this.vehiculo.set(vehicles[0]);
            }
        },
        error: (err) => console.error('Error al cargar vehículos:', err),
        complete: () => this.isLoading.set(false)
      });

    } else {
        this.isLoading.set(false);
    }
  }

  constructor(private router: Router, authService: AuthService) {}

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
