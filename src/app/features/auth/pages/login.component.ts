import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="login-layout">
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
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">

          <div class="form-group">
            <input
              type="email"
              formControlName="email"
              placeholder="Correo universitario"
              [class.error-border]="isFieldInvalid('email')">
          </div>

          <div class="form-group">
            <input
              type="password"
              formControlName="password"
              placeholder="Contraseña"
              [class.error-border]="isFieldInvalid('password')">
          </div>

          <div class="form-options">
            <label class="checkbox-container">
              <input type="checkbox"> Recordarme
            </label>
          </div>

          @if (errorMessage()) {
            <div class="alert-error">{{ errorMessage() }}</div>
          }

          <button type="submit" class="btn-submit" [disabled]="loginForm.invalid || loading()">
            @if (loading()) {
              <span>Ingresando...</span>
            } @else {
              <span>Iniciar sesión</span>
            }
          </button>

          <div class="forgot-password">
            <a href="#">¿Olvidaste contraseña?</a>
          </div>

          <div class="register-link">
             ¿No tienes cuenta? <a routerLink="/auth/register" class="link-red">Regístrate aquí</a>
          </div>

        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-layout {
      min-height: 100vh;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .uniride-header {
      width: 100%;
      background-color: #D50100;
      padding: 50px 0;
      display: flex;
      justify-content: center;
      margin-bottom: 60px;
    }

    .header-content { text-align: center; color: white; }
    .logo-container { font-size: 3.5rem; display: flex; justify-content: center; gap: 10px; margin-bottom: 10px; }
    .pole { font-size: 2.2rem; opacity: 0.8; margin-top: 12px; }
    .brand-name { font-family: 'Roboto', sans-serif; font-weight: 700; font-size: 2.8rem; letter-spacing: 2px; margin: 0; }

    .form-container { width: 100%; max-width: 400px; padding: 0 20px; }
    .login-form { display: flex; flex-direction: column; gap: 30px; }

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
    input:focus { border-bottom-color: #D50100; }
    .error-border { border-bottom-color: #D50100; }

    .form-options { display: flex; align-items: center; font-size: 0.9rem; color: #666; margin-top: -10px; }
    .checkbox-container input { width: auto; margin-right: 8px; }

    .btn-submit {
      background-color: #D50100;
      color: white;
      border: none;
      padding: 15px;
      border-radius: 30px;
      font-size: 1.1rem;
      font-weight: bold;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    .btn-submit:hover:not(:disabled) { background-color: #b00000; }
    .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

    .forgot-password { text-align: center; margin-top: -10px; font-size: 0.85rem; }
    .forgot-password a { color: #999; text-decoration: none; }

    .register-link { text-align: center; font-size: 0.9rem; color: #666; margin-top: 20px; }
    .link-red { color: #D50100; text-decoration: none; font-weight: bold; }
    .alert-error { color: #D50100; text-align: center; font-size: 0.9rem; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  errorMessage = signal('');

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control?.invalid && control?.touched);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.errorMessage.set('');

      const credentials: LoginRequest = {
        correo: this.loginForm.value.email,
        contrasena: this.loginForm.value.password
      };

      this.authService.login(credentials).subscribe({
        next: () => {
          //this.router.navigate(['/home']);
        },
        error: () => {
          this.errorMessage.set('Credenciales incorrectas.');
          this.loading.set(false);
        }
      });
    }
  }
}
