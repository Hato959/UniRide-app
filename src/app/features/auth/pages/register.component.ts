import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models/auth.model';
import { AuthValidators } from '../validators/auth.validators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: '../../../core/static/register-component/register.component.html',
  styleUrl: '../../../core/static/register-component/register.component.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  errorMessage = signal('');

  registerForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, AuthValidators.fullName()]],
    correoInstitucional: ['', [Validators.required, Validators.email]],
    dni: ['', [Validators.required, AuthValidators.peruvianDNI()]],
    distrito: ['', Validators.required],
    carrera: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
    rolActivo: ['PASAJERO', Validators.required]
  });

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control?.invalid && control?.touched);
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const request: RegisterRequest = this.registerForm.value;

    this.authService.register(request).subscribe({
      next: () => {
        // Redirigir al dashboard o home tras registro exitoso
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage.set('Error al registrar. Verifica tus datos.');
        this.loading.set(false);
      }
    });
  }
}
