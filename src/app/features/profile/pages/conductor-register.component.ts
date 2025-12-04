import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarUserComponent } from './../../../shared/components/navbar-user.component';
import { DriverService } from './../../../core/services/driver.service';
import { AuthService } from './../../../core/services/auth.service';

@Component({
  selector: 'app-conductor-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarUserComponent],
  templateUrl: '../../../core/static/conductor-register-component/conductor-register.component.html',
  styleUrl: '../../../core/static/conductor-register-component/conductor-register.component.css'
})
export class ConductorRegisterComponent {
  form: FormGroup;
  statusMessage = '';
  isError = false;

  constructor(
    private fb: FormBuilder,
    private driverService: DriverService,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      licenciaConducir: ['', Validators.required],
      experienciaAnios: [0, [Validators.required, Validators.min(0)]]
    });
  }

  registrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const usuarioId = this.authService.currentUsuarioId;
    if (!usuarioId) {
      this.setStatus('No se pudo obtener el ID del usuario.', true);
      return;
    }

    const payload = {
      usuarioId,
      licenciaConducir: this.form.value.licenciaConducir,
      experienciaAnios: this.form.value.experienciaAnios
    };

    this.driverService.registrarConductor(payload).subscribe({
      next: () => {
        this.setStatus('Conductor registrado exitosamente.', false);
        this.router.navigate(['/perfil', 'conductor_perfil']);
      },
      error: (err) => {
        const msg = err?.error?.message || err?.message || 'Error al registrar el conductor.';
        this.setStatus(msg, true);
      }
    });
  }

  private setStatus(msg: string, isError: boolean): void {
    this.statusMessage = msg;
    this.isError = isError;
  }
}
