import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs'; // Importar Observable para tipado
import { AuthService } from './../../../core/services/auth.service';
import { DriverService } from './../../../core/services/driver.service';
import { VehiculoRegisterRequest } from './../../../core/models/driver.model';

@Component({
  selector: 'app-vehicle-data',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: '../../../core/static/vehicle-data-component/vehicle-data.component.html',
  // Reutiliza estilos de edición y añade el centrado del onboarding
  styleUrl: '../../../core/static/edit-profile-component/edit-profile.component.css',
  styles: [`
    /* Sobreescribe estilos para centrar el formulario como una tarjeta */
    .onboarding-layout {
      min-height: calc(100vh - 70px);
      background-color: #BFBFBF;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 50px 20px;
    }
    .form-card-wrapper {
        width: 100%;
        max-width: 500px;
    }
    .onboarding-card {
        background: white;
        border-radius: 15px;
        padding: 40px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    }
    .title-main {
        text-align: center;
        font-size: 2rem;
        margin-bottom: 30px;
        color: #333;
    }
    .form-group {
        margin-bottom: 25px;
    }
    /* Estilos de input heredados de edit-profile.component.css */
    .btn-confirm {
        background-color: #D50100;
        color: white;
        border: none;
        padding: 15px 0;
        width: 100%;
        border-radius: 5px;
        font-weight: bold;
        font-size: 1.1rem;
        cursor: pointer;
        transition: background 0.3s;
        margin-top: 20px;
    }
    .btn-confirm:hover:not(:disabled) { background-color: #b00000; }
    .alert-error { text-align: center; margin-top: 15px; }
    .error-text { color: #D50100; font-size: 0.8rem; margin-top: -15px; display: block; }
  `]
})
export class VehicleDataComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private driverService = inject(DriverService);
  private router = inject(Router);

  loading = signal(false);
  errorMessage = signal('');

  // El DTO de backend requiere Placa, Marca, Modelo, Color, ConductorId
  vehicleForm: FormGroup = this.fb.group({
    placa: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{3,7}$/)]], // Placa (ej. 3 a 7 caracteres alfanuméricos)
    marca: ['', Validators.required],
    modelo: ['', Validators.required],
    color: ['', Validators.required], // Requerido por el backend
  });

  ngOnInit(): void {
    // Protección: Si no tiene ID de Conductor, redirigir al paso 1 (Licencia).
    if (!this.authService.currentConductorId) {
      this.router.navigate(['/perfil/registro-licencia']);
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.vehicleForm.get(field);
    return !!(control?.invalid && control?.touched);
  }

  onSubmit() {
    if (this.vehicleForm.invalid || !this.authService.currentConductorId) {
      this.vehicleForm.markAllAsTouched();
      this.errorMessage.set('Completa los datos del vehículo correctamente.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    // Obtener el ID del conductor de la sesión (debe existir)
    const conductorId = this.authService.currentConductorId!;

    const request: VehiculoRegisterRequest = {
      // Mapear los campos del formulario
      ...this.vehicleForm.value,
      conductorId: conductorId,
    };

    this.driverService.registrarVehiculo(request).subscribe({
      next: () => {
        this.router.navigate(['/perfil/conductor']);
      },
      error: (err) => {
        this.errorMessage.set(err.message || 'Error al registrar el vehículo. Verifica la placa.');
        this.loading.set(false);
      }
    });
  }
}
