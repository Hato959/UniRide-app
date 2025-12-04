import { Component, inject, OnInit, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { AuthService } from './../../../core/services/auth.service';
import { UserService } from './../../../core/services/user.service';
import { DriverService } from './../../../core/services/driver.service';
import { AuthValidators } from './../../auth/validators/auth.validators';
import { UsuarioResponse } from './../../../core/models/user.model';
import { UsuarioRegisterRequest } from './../../../core/models/auth.model';
import { ConductorInfoResponse,ConductorResponse, ConductorRegisterRequest, VehiculoResponse, VehiculoRegisterRequest } from './../../../core/models/driver.model';

@Component({
  selector: 'app-edit-conductor-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: '../../../core/static/edit-conductor-profile-component/edit-conductor-profile.component.html',
  styleUrl: '../../../core/static/edit-profile-component/edit-profile.component.css',
  styles: [`

    .edit-profile-grid-driver {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr;
      gap: 30px;
      align-items: flex-start;
    }
    .user-info-card { grid-column: 1 / 2; }
    .vehicle-info-card { grid-column: 2 / 3; }
    .photo-upload-card { grid-column: 3 / 4; }

    .card-title.sub-title {
        margin-top: 30px;
        padding-top: 10px;
        border-top: 1px solid #eee;
    }
    .vehicle-photo-placeholder img {
        width: 100%;
        height: auto;
        border-radius: 5px;
        object-fit: cover;
    }
    .mt-8 { margin-top: 8px; }

    /* Responsive */
    @media (max-width: 1024px) {
        .edit-profile-grid-driver {
            grid-template-columns: 1fr 1fr;
        }
        .user-info-card { grid-column: 1 / 3; }
        .vehicle-info-card { grid-column: 1 / 2; }
        .photo-upload-card { grid-column: 2 / 3; }
    }
    @media (max-width: 768px) {
        .edit-profile-grid-driver {
            grid-template-columns: 1fr;
        }
        .user-info-card, .vehicle-info-card, .photo-upload-card { grid-column: 1 / -1; }
    }
  `]
})
export class EditConductorProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('vehicleFileInput') vehicleFileInput!: ElementRef;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private driverService = inject(DriverService);
  private router = inject(Router);

  usuario = signal<UsuarioResponse | null>(null);
  conductor = signal<ConductorResponse | null>(null);
  vehiculo = signal<VehiculoResponse | null>(null);

  loading = signal(false);
  loadingVehicle = signal(false);
  loadingPhoto = signal(false);
  errorMessage = signal('');

  userForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, AuthValidators.fullName()]],
    carrera: ['', Validators.required],
    distrito: ['', Validators.required],
    licenciaConducir: ['', Validators.required],
    experienciaAnios: [null as number | null, [Validators.required, Validators.min(0)]],
  });

  vehicleForm: FormGroup = this.fb.group({
    placa: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{3,7}$/)]],
    marca: ['', Validators.required],
    modelo: ['', Validators.required],
    color: ['', Validators.required] });


  ngOnInit(): void {
    if (!this.authService.currentConductorId) {
        this.router.navigate(['/perfil/pasajero']);
        return;
    }
    this.loadAllData();
  }

  loadAllData(): void {
    const usuarioId = this.authService.currentUsuarioId;
    const conductorId = this.authService.currentConductorId;

    if (!usuarioId || !conductorId) return;

    forkJoin({
      user: this.userService.getProfile(usuarioId),
      driver: this.driverService.obtenerPerfil(usuarioId),
      vehicles: this.driverService.getMisVehiculos(conductorId)
    }).subscribe({
      next: ({ user, driver, vehicles }) => {
        this.usuario.set(user);
        this.conductor.set(driver);
        this.vehiculo.set(vehicles.length > 0 ? vehicles[0] : null);

        this.userForm.patchValue({
          nombre: user.nombre,
          carrera: user.carrera,
          distrito: user.distrito,
          licenciaConducir: driver.licenciaConducir,
          experienciaAnios: driver.experienciaAnios
        });

        if (this.vehiculo()) {
            const v = this.vehiculo()!;
            this.vehicleForm.patchValue({
                placa: v.placa,
                marca: v.marca,
                modelo: v.modelo,
                color: v.color
            });
        }
      },
      error: (err) => {
        this.errorMessage.set('Error al cargar datos: ' + (err.message || 'Error de red.'));
      }
    });
  }

  isFieldInvalid(form: FormGroup, field: string): boolean {
    const control = form.get(field);
    return !!(control?.invalid && control?.touched);
  }

  getInitialLetter(): string {
    const name = this.usuario()?.nombre;
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.errorMessage.set('Completa los campos de Usuario y Conducción.');
      return;
    }

    const userId = this.authService.currentUsuarioId;
    const currentData = this.usuario();
    if (!userId || !currentData) return;

    this.loading.set(true);
    this.errorMessage.set('');

    const userRequest: UsuarioRegisterRequest = {
        nombre: this.userForm.value.nombre,
        carrera: this.userForm.value.carrera,
        distrito: this.userForm.value.distrito,
        correoInstitucional: currentData.correoInstitucional,
        dni: currentData.dni,
        contrasena: 'PLACEHOLDER',
    };

    const driverRequest: ConductorRegisterRequest = {
        usuarioId: userId,
        licenciaConducir: this.userForm.value.licenciaConducir,
        experienciaAnios: Number(this.userForm.value.experienciaAnios)
    };

    forkJoin([
        this.userService.actualizar(userId, userRequest),
        this.driverService.actualizarConductor(userId, driverRequest)
    ]).subscribe({
        next: () => {
            this.router.navigate(['/perfil/conductor']);
        },
        error: (err) => {
            this.errorMessage.set(err.message || 'Error al actualizar perfil general.');
            this.loading.set(false);
        }
    });
  }

  onVehicleSubmit(): void {
    if (this.vehicleForm.invalid) {
        this.vehicleForm.markAllAsTouched();
        this.errorMessage.set('Completa los datos del vehículo.');
        return;
    }

    const currentVehiculo = this.vehiculo();
    const conductorId = this.authService.currentConductorId;

    if (!currentVehiculo || !conductorId) {
        this.errorMessage.set('No hay vehículo registrado. Usa el formulario de registro.');
        return;
    }

    this.loadingVehicle.set(true);
    this.errorMessage.set('');

    const request: VehiculoRegisterRequest = {
        conductorId: conductorId,
        placa: this.vehicleForm.value.placa,
        marca: this.vehicleForm.value.marca,
        modelo: this.vehicleForm.value.modelo,
        color: this.vehicleForm.value.color
    };


    this.driverService.actualizarVehiculo(currentVehiculo.id, request).subscribe({
        next: (updatedVehiculo) => {
            this.vehiculo.set(updatedVehiculo);
            this.errorMessage.set('Vehículo actualizado con éxito.');
            this.loadingVehicle.set(false);
        },
        error: (err) => {
            this.errorMessage.set(err.message || 'Error al actualizar el vehículo.');
            this.loadingVehicle.set(false);
        }
    });
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const file = element.files?.[0];

    if (file) {
      this.subirFoto(file, this.userService.subirFotoPerfil(this.authService.currentUsuarioId!, file));
    }
  }

  onVehiclePhotoSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const file = element.files?.[0];
    const currentVehiculo = this.vehiculo();

    if (!file) return;

    if (!currentVehiculo) {
        this.errorMessage.set('Debe registrar o cargar el vehículo primero.');
        return;
    }

    this.loadingPhoto.set(true);
    this.errorMessage.set('');

    this.driverService.subirFotoVehiculo(currentVehiculo.id, file).subscribe({
        next: (updatedVehiculo) => {
            this.vehiculo.set(updatedVehiculo);
            this.errorMessage.set('Foto de vehículo subida con éxito.');
            this.loadingPhoto.set(false);
        },
        error: (err) => {
            this.errorMessage.set('Error al subir la foto: ' + (err.message || 'Error desconocido.'));
            this.loadingPhoto.set(false);
        }
    });
  }

  subirFoto(file: File, uploadObs: Observable<UsuarioResponse>): void {
    this.loadingPhoto.set(true);
    this.errorMessage.set('');

    uploadObs.subscribe({
      next: (user) => {
        this.usuario.set(user);
        this.errorMessage.set('Foto de perfil subida con éxito.');
        this.loadingPhoto.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Error al subir la foto: ' + (err.message || 'Error desconocido.'));
        this.loadingPhoto.set(false);
      }
    });
  }
}
