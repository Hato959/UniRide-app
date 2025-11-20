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
  template: `
    <div class="register-layout">
      <header class="uniride-header">
        <div class="header-content">
          <div class="logo-container">
            <i class="fas fa-grip-lines-vertical pole"></i>
            <i class="fas fa-car-side car-icon"></i>
            <i class="fas fa-grip-lines-vertical pole"></i>
          </div>
          <h1 class="brand-name">UNIRIDE</h1>
        </div>
      </header>

      <div class="form-container">
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">

          <div class="form-group">
            <input
              type="text"
              formControlName="nombre"
              placeholder="Nombre completo"
              [class.error-border]="isFieldInvalid('nombre')">
          </div>

          <div class="form-group">
            <input
              type="email"
              formControlName="correoInstitucional"
              placeholder="Correo universitario"
              [class.error-border]="isFieldInvalid('correoInstitucional')">
            @if (isFieldInvalid('correoInstitucional')) {
              <small class="error-text">Debe ser un correo @upc.edu.pe válido</small>
            }
          </div>

          <div class="form-row">
            <div class="form-group half">
              <input
                type="text"
                formControlName="dni"
                placeholder="DNI"
                maxlength="8"
                [class.error-border]="isFieldInvalid('dni')">
            </div>
            <div class="form-group half">
              <input
                type="text"
                formControlName="distrito"
                placeholder="Distrito"
                [class.error-border]="isFieldInvalid('distrito')">
            </div>
          </div>

          <div class="form-group">
            <input
              type="text"
              formControlName="carrera"
              placeholder="Carrera"
              [class.error-border]="isFieldInvalid('carrera')">
          </div>

          <div class="form-group">
            <input
              type="text"
              formControlName="telefono"
              placeholder="Teléfono"
              [class.error-border]="isFieldInvalid('telefono')">
          </div>

          <div class="form-group">
            <input
              type="password"
              formControlName="contrasena"
              placeholder="Contraseña"
              [class.error-border]="isFieldInvalid('contrasena')">
          </div>

          <div class="form-group role-group">
            <label>Quiero registrarme como:</label>
            <div class="role-options">
              <label class="radio-container">Pasajero
                <input type="radio" formControlName="rolActivo" value="PASAJERO">
                <span class="checkmark"></span>
              </label>
              <label class="radio-container">Conductor
                <input type="radio" formControlName="rolActivo" value="CONDUCTOR">
                <span class="checkmark"></span>
              </label>
            </div>
          </div>

          @if (errorMessage()) {
            <div class="alert-error">{{ errorMessage() }}</div>
          }

          <button type="submit" class="btn-submit" [disabled]="registerForm.invalid || loading()">
            @if (loading()) {
              <span>Registrando...</span>
            } @else {
              <span>Registrarse</span>
            }
          </button>

          <div class="login-link">
             ¿Ya tienes cuenta? <a routerLink="/auth/login">Inicia sesión aquí</a>
          </div>

        </form>
      </div>
    </div>
  `,
  styles: [`
    .register-layout {
      min-height: 100vh;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    /* HEADER ROJO */
    .uniride-header {
      width: 100%;
      background-color: #D50100;
      padding: 40px 0;
      display: flex;
      justify-content: center;
      margin-bottom: 40px;
    }

    .header-content {
      text-align: center;
      color: white;
    }

    .logo-container {
      font-size: 3rem;
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-bottom: 10px;
    }

    .pole { font-size: 2rem; opacity: 0.8; margin-top: 10px; }

    .brand-name {
      font-family: 'Roboto', sans-serif;
      font-weight: 700;
      font-size: 2.5rem;
      letter-spacing: 2px;
      margin: 0;
    }

    /* FORMULARIO */
    .form-container {
      width: 100%;
      max-width: 450px;
      padding: 0 20px;
    }

    .register-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-row {
      display: flex;
      gap: 15px;
    }

    .half { flex: 1; }

    input {
      width: 100%;
      padding: 12px 0;
      border: none;
      border-bottom: 1px solid #ccc;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.3s;
      color: #555;
    }

    input::placeholder { color: #aaa; }

    input:focus {
      border-bottom-color: #D50100;
    }

    .error-border {
      border-bottom-color: #D50100;
    }

    .error-text {
      color: #D50100;
      font-size: 0.8rem;
      margin-top: 5px;
      display: block;
    }

    /* RADIO BUTTONS */
    .role-group label {
        display: block;
        margin-bottom: 10px;
        color: #666;
        font-size: 0.9rem;
    }

    .role-options {
        display: flex;
        gap: 30px;
    }

    .radio-container {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        font-size: 1rem;
        color: #333;
    }

    /* BOTÓN */
    .btn-submit {
      background-color: #D50100;
      color: white;
      border: none;
      padding: 15px;
      border-radius: 30px;
      font-size: 1.1rem;
      font-weight: bold;
      cursor: pointer;
      margin-top: 20px;
      transition: background-color 0.3s;
    }

    .btn-submit:hover:not(:disabled) {
      background-color: #b00000;
    }

    .btn-submit:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .alert-error {
        color: #D50100;
        text-align: center;
        font-size: 0.9rem;
    }

    .login-link {
        text-align: center;
        font-size: 0.9rem;
        color: #666;
    }

    .login-link a {
        color: #D50100;
        text-decoration: none;
        font-weight: bold;
    }
  `]
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
        this.router.navigate(['/perfil']);
      },
      error: (err) => {
        this.errorMessage.set('Error al registrar. Verifica tus datos.');
        this.loading.set(false);
      }
    });
  }
}
