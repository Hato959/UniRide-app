import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './../../../core/services/auth.service';
import { DriverService } from './../../../core/services/driver.service';
import { ConductorRegisterRequest } from './../../../core/models/driver.model';

@Component({
  selector: 'app-driver-onboarding-paso1',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: '../../../core/static/driver-onboarding-paso1-component/driver-onboarding-paso1.component.html',
  styleUrl: '../../../core/static/driver-onboarding-paso1-component/driver-onboarding-paso1.component.css',
})
export class DriverOnboardingPaso1Component implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private driverService = inject(DriverService);
  private router = inject(Router);

  loading = signal(false);
  errorMessage = signal('');

  driverForm: FormGroup = this.fb.group({
    licenciaConducir: ['', Validators.required],
    experienciaAnios: ['', [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    if (this.authService.currentConductorId) {
      // Si ya tiene el ID, asumir que le falta el vehículo y enviarlo al Paso 2
      this.router.navigate(['/perfil/registro-vehiculo']);
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.driverForm.get(field);
    return !!(control?.invalid && control?.touched);
  }

  onSubmit() {
    if (this.driverForm.invalid) {
      this.driverForm.markAllAsTouched();
      return;
    }

    const usuarioId = this.authService.currentUsuarioId;
    if (!usuarioId) return;

    this.loading.set(true);
    this.errorMessage.set('');

    const request: ConductorRegisterRequest = {
      ...this.driverForm.value,
      usuarioId: usuarioId
    };

    this.driverService.registrarConductor(request).subscribe({
      next: (response) => {
        // 1. Éxito: El conductor ID fue creado. Lo guardamos en la sesión.
        this.authService.updateConductorId(response.id); // ASUMIMOS que existe este método en AuthService

        // 2. Redirigir al siguiente paso: Datos del Vehículo
        this.router.navigate(['/perfil/registro-vehiculo']);
      },
      error: (err) => {
        this.errorMessage.set(err.message || 'Error al registrar el perfil de conductor.');
        this.loading.set(false);
      }
    });
  }
}
