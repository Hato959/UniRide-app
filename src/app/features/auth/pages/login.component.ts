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
  templateUrl: '../../../core/static/login-component/login.component.html',
  styleUrl: '../../../core/static/login-component/login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  //private router = inject(Router);

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

  constructor(private router: Router) {
    console.log('Router config:', this.router.config);
    console.log('Router paths:', this.router.config.map(r => r.path));
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
        next: (perfil) => {
          if (!perfil?.rol) {
            this.router.navigate(['/home']);
            return;
          }

          if (perfil.rol === 'CONDUCTOR') {
            this.router.navigate(['/driver_home', 'conductor_perfil']);
          } else if (perfil.rol === 'PASAJERO') {
            this.router.navigate(['/user_home', 'perfil_usuario']);
          } else {
            this.router.navigate(['/home']);
          }
        },
        error: () => {
          console.log('Attempting login with credentials:', credentials); // debugging
          this.errorMessage.set('Credenciales incorrectas.');
          this.loading.set(false);
        }
      });
    }
  }
}
