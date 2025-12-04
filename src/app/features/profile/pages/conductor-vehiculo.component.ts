import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarUserComponent } from './../../../shared/components/navbar-user.component';
import { DriverService } from './../../../core/services/driver.service';
import { AuthService } from './../../../core/services/auth.service';

@Component({
  selector: 'app-conductor-vehiculo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarUserComponent],
  templateUrl: '../../../core/static/conductor-vehiculo-component/conductor-vehiculo.component.html',
  styleUrl: '../../../core/static/conductor-vehiculo-component/conductor-vehiculo.component.css'
})
export class ConductorVehiculoComponent {
  form: FormGroup;
  statusMessage = '';
  isError = false;
  private conductorId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private driverService: DriverService,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      color: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      placa: ['', Validators.required],
    });
  }

  ngOnInit(): void {
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

  registrarVehiculo(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.conductorId) {
      this.setStatus('No se pudo obtener el ID de conductor.', true);
      return;
    }

    const payload = {
      conductorId: this.conductorId,
      marca: this.form.value.marca,
      placa: this.form.value.placa,
      modelo: this.form.value.modelo,
      color: this.form.value.color
    };

    this.driverService.registrarVehiculo(payload).subscribe({
      next: () => {
        this.setStatus('Vehículo registrado exitosamente.', false);
        this.router.navigate(['/driver_home', 'conductor_perfil']);
      },
      error: (err) => {
        const msg = err?.error?.message || err?.message || 'Error al registrar el vehículo.';
        this.setStatus(msg, true);
      }
    });
  }

  private setStatus(msg: string, isError: boolean): void {
    this.statusMessage = msg;
    this.isError = isError;
  }
}
