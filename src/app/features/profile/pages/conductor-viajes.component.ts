import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarUserComponent } from './../../../shared/components/navbar-user.component';
import { TripService } from './../../../core/services/trip.service';
import { AuthService } from './../../../core/services/auth.service';
import { DriverService } from './../../../core/services/driver.service';
import { ViajeResponse } from './../../../core/models/trip.model';

@Component({
  selector: 'app-conductor-viajes',
  standalone: true,
  imports: [CommonModule, NavbarUserComponent],
  templateUrl: '../../../core/static/conductor-viajes-component/conductor-viajes.component.html',
  styleUrl: '../../../core/static/conductor-viajes-component/conductor-viajes.component.css'
})
export class ConductorViajesComponent implements OnInit {
  viajes: ViajeResponse[] = [];
  loading = true;
  errorMessage = '';
  private conductorId: number | null = null;

  constructor(
    private tripService: TripService,
    private authService: AuthService,
    private driverService: DriverService
  ) {}

  ngOnInit(): void {
    this.resolveConductorId().then(id => {
      if (!id) {
        this.errorMessage = 'No se pudo obtener el ID de conductor.';
        this.loading = false;
        return;
      }
      this.loadViajes(id);
    });
  }

  private async resolveConductorId(): Promise<number | null> {
    const cached = this.authService.currentConductorId;
    if (cached) return cached;

    const usuarioId = this.authService.currentUsuarioId;
    if (!usuarioId) return null;

    try {
      const conductor = await this.driverService.obtenerConductorPorUsuario(usuarioId).toPromise();
      return conductor?.id || null;
    } catch (e) {
      console.error('Error al obtener el conductor:', e);
      return null;
    }
  }

  private loadViajes(conductorId: number): void {
    console.log(conductorId); // debug
    this.tripService.listarViajes().subscribe({
      next: (lista) => {
        this.viajes = lista.filter(v => v.idConductor === conductorId);
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || err?.message || 'Error al cargar viajes.';
        this.loading = false;
      }
    });
    console.log("loadViajes salio"); // debug
  }
}
