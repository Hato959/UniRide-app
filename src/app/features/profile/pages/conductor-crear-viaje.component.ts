import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavbarUserComponent } from './../../../shared/components/navbar-user.component';
import { TripService } from './../../../core/services/trip.service';
import { AuthService } from './../../../core/services/auth.service';
import { DriverService } from './../../../core/services/driver.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conductor-crear-viaje',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarUserComponent],
  templateUrl: '../../../core/static/conductor-crear-viaje-component/conductor-crear-viaje.component.html',
  styleUrl: '../../../core/static/conductor-crear-viaje-component/conductor-crear-viaje.component.css'
})
export class ConductorCrearViajeComponent implements OnInit {
  form: FormGroup;
  statusMessage = '';
  isError = false;
  private conductorId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private tripService: TripService,
    private authService: AuthService,
    private driverService: DriverService,
    private router: Router
  ) {
    this.form = this.fb.group({
      origen: ['', Validators.required],
      destino: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      asientos: [1, [Validators.required, Validators.min(1)]],
      recurrente: [false]
    });
  }

  ngOnInit(): void {
    const cachedConductorId = this.authService.currentConductorId;
    if (cachedConductorId) {
      this.conductorId = cachedConductorId;
      return;
    }

    const usuarioId = this.authService.currentUsuarioId;
    if (!usuarioId) {
      this.setStatus('No se pudo obtener el ID de usuario.', true);
      return;
    }

    this.driverService.obtenerConductorPorUsuario(usuarioId).subscribe({
      next: (conductor) => {
        this.conductorId = conductor.id;
      },
      error: (err) => {
        const msg = err?.error?.message || err?.message || 'No se pudo cargar la info del conductor.';
        this.setStatus(msg, true);
      }
    });
  }

  publicar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.conductorId) {
      this.setStatus('No se pudo obtener el ID de conductor.', true);
      return;
    }

    const payload = {
      idConductor: this.conductorId,
      origen: this.form.value.origen,
      destino: this.form.value.destino,
      fecha: this.form.value.fecha, // date input -> YYYY-MM-DD (LocalDate-friendly)
      hora: this.normalizeTime(this.form.value.hora), // ensure HH:mm:ss for LocalTime
      asientosDisponibles: Number(this.form.value.asientos),
      recurrente: this.form.value.recurrente
    };
    console.log(payload);// debug
    this.tripService.create(payload).subscribe({
      next: () => {
        this.setStatus('Viaje publicado con exito.', false);
        this.router.navigate(['/driver_home', 'conductor_perfil']);
      },
      error: (err) => {
        const msg = err?.error?.message || err?.message || 'Error al publicar el viaje.';
        this.setStatus(msg, true);
      }
    });
  }

  private setStatus(msg: string, isError: boolean): void {
    this.statusMessage = msg;
    this.isError = isError;
  }

  private normalizeTime(raw: string): string {
    if (!raw) return raw;
    // If time comes as HH:mm, append seconds to satisfy LocalTime parsing
    return raw.length === 5 ? `${raw}:00` : raw;
  }
}
