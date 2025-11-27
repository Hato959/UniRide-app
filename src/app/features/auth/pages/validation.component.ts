import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './../../../core/services/auth.service';
import { ValidationService } from './../../../core/services/validation.service';
import { ValidacionUsuarioRequest } from './../../../core/models/auth.model';
import { AuthValidators } from './../validators/auth.validators';

@Component({
  selector: 'app-validation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="validation-layout">
      <!-- HEADER ROJO -->
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

      <!-- CONTENEDOR DEL FORMULARIO -->
      <div class="form-container">

        <!-- CABECERA TEXTO -->
        <div class="validation-header">
          <h2>Verifica tu identidad para continuar</h2>
          <p>Hola {{ getUserName() }}!<br>Para continuar, verifica tu correo y DNI</p>
        </div>

        <div class="validation-card">
          <form [formGroup]="validationForm">

            <!-- SECCIÓN 1: Correo -->
            <div class="form-section">
              <div class="input-row">
                <i class="far fa-envelope icon-red"></i>
                <input
                  type="email"
                  formControlName="email"
                  placeholder="ejemplo@upc.edu.pe"
                  class="clean-input"
                  [class.error-text]="isFieldInvalid('email')"
                  readonly> <!-- Campo de sólo lectura -->
              </div>
              @if (isFieldInvalid('email')) {
                <small class="error-msg">Correo inválido</small>
              }

              <div class="action-row">
                <div class="info-text">
                  <i class="fas fa-key icon-red-small"></i>
                  <div class="text-block">
                    <span>Código de verificación</span>
                    <small>enviado al correo</small>
                  </div>
                </div>
                <!-- Botón de Envío de Código -->
                <button
                  type="button"
                  (click)="enviarCodigo()"
                  class="btn-secondary"
                  [disabled]="loadingCode()">
                  {{ loadingCode() ? 'Enviando...' : (codeSent() ? 'Reenviar código' : 'Enviar código') }}
                </button>
              </div>
            </div>

            <div class="divider"></div>

            <!-- SECCIÓN 2: DNI y Código -->
            <div class="form-section bottom-section">

              <!-- Input DNI -->
              <div class="input-line-group">
                <input
                  type="text"
                  formControlName="dni"
                  placeholder="Ingresa DNI"
                  class="line-input"
                  maxlength="8"
                  [class.error-border]="isFieldInvalid('dni')">

                <!-- Botón de formato DNI -->
                <button type="button" (click)="validarFormatoDni()" class="btn-red btn-medium">Verificar DNI</button>
              </div>
              @if (isFieldInvalid('dni')) {
                <small class="error-msg">DNI debe tener 8 dígitos</small>
              }

              <!-- Input Código -->
              <div class="input-line-group">
                <input
                  type="text"
                  formControlName="codigo"
                  placeholder="Ingresar código"
                  class="line-input"
                  maxlength="6"
                  [class.error-border]="isFieldInvalid('codigo')">
              </div>
              @if (isFieldInvalid('codigo')) {
                <small class="error-msg">Código requerido</small>
              }

              <!-- Mensajes de Estado -->
              @if (message()) {
                <div class="status-message" [class.error]="isError()" [class.success]="!isError()">
                  {{ message() }}
                </div>
              }

              <!-- Botón Final -->
              <div class="footer-action">
                <button
                  type="button"
                  (click)="verificarCuenta()"
                  class="btn-red btn-large"
                  [disabled]="loadingVerify()">
                  {{ loadingVerify() ? 'Verificando...' : 'Verificar mi cuenta' }}
                </button>
              </div>

            </div>
          </form>
        </div>

        <div class="footer-note">
            <i class="fas fa-lock icon-red big-icon"></i>
            <p>Tu información será usada solo para validar que eres estudiante universitario.</p>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .validation-layout {
      min-height: 100vh;
      background-color: #BFBFBF;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: 'Roboto', sans-serif;
    }

    /* HEADER ROJO (Reutilizado para consistencia) */
    .uniride-header {
      width: 100%;
      background-color: #D50100;
      padding: 40px 0;
      display: flex;
      justify-content: center;
      margin-bottom: 30px;
    }
    .header-content { text-align: center; color: white; }
    .logo-container { font-size: 3rem; display: flex; justify-content: center; gap: 10px; margin-bottom: 10px; }
    .pole { font-size: 2rem; opacity: 0.8; margin-top: 10px; }
    .brand-name { font-family: 'Roboto', sans-serif; font-weight: 700; font-size: 2.5rem; letter-spacing: 2px; margin: 0; }

    /* CONTENEDOR */
    .form-container {
      width: 100%;
      max-width: 600px;
      padding: 0 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .validation-header { text-align: center; margin-bottom: 20px; color: #000; }
    .validation-header h2 { font-size: 1.6rem; font-weight: 700; margin-bottom: 10px; }
    .validation-header p { font-size: 1rem; color: #444; line-height: 1.4; }

    .validation-card {
      background: white;
      width: 100%;
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    /* ELEMENTOS DE FORMULARIO */
    .icon-red { color: #D50100; font-size: 1.4rem; min-width: 30px; }
    .icon-red-small { color: #D50100; font-size: 1.1rem; margin-right: 8px; }

    .clean-input {
      border: none;
      font-size: 1.1rem;
      width: 100%;
      outline: none;
      color: #333;
      background: transparent;
    }

    .input-row { display: flex; align-items: center; margin-bottom: 5px; }

    .action-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
    }

    .info-text { display: flex; align-items: center; }
    .text-block { display: flex; flex-direction: column; line-height: 1.2; font-size: 0.9rem; color: #333; }
    .text-block small { color: #666; font-size: 0.8rem; }

    .btn-secondary {
      background: white;
      border: 1px solid #D50100;
      color: #D50100;
      padding: 6px 12px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      transition: 0.2s;
    }
    .btn-secondary:hover:not(:disabled) { background: #fff5f5; }
    .btn-secondary:disabled { border-color: #ccc; color: #ccc; cursor: not-allowed; }

    .divider { height: 1px; background: #eee; margin: 25px 0; }

    .bottom-section { display: flex; flex-direction: column; gap: 20px; }

    .input-line-group {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 15px;
    }

    .line-input {
      border: none;
      border-bottom: 1px solid #ccc;
      padding: 8px 0;
      width: 100%;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.3s;
    }
    .line-input:focus { border-bottom-color: #D50100; }
    .error-border { border-bottom-color: #D50100; }
    .error-msg { color: #D50100; font-size: 0.8rem; margin-top: -15px; display: block; }
    .error-text { color: #D50100; }

    /* BOTONES ROJOS */
    .btn-red {
      background-color: #D50100;
      color: white;
      border: none;
      border-radius: 20px;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .btn-red:hover:not(:disabled) { background-color: #b00000; }
    .btn-red:disabled { background-color: #ccc; cursor: not-allowed; }

    .btn-medium { padding: 8px 20px; font-size: 0.9rem; white-space: nowrap; }
    .btn-large { padding: 12px 0; font-size: 1rem; width: 100%; }

    .footer-action { margin-top: 10px; }

    /* MENSAJES */
    .status-message { padding: 10px; border-radius: 8px; text-align: center; font-size: 0.9rem; margin-top: 10px; }
    .status-message.error { background-color: #ffe6e6; color: #D50100; }
    .status-message.success { background-color: #d4edda; color: #155724; }

    /* FOOTER NOTE */
    .footer-note {
      margin-top: 30px;
      display: flex;
      align-items: center;
      gap: 15px;
      color: #555;
      font-size: 0.85rem;
    }
    .big-icon { font-size: 1.8rem; }
    .footer-note p { margin: 0; line-height: 1.4; }

    @media (max-width: 600px) {
      .action-row { flex-direction: column; align-items: flex-start; gap: 15px; }
      .btn-medium { width: 100%; margin-top: 10px; }
      .input-line-group { flex-direction: column; align-items: flex-start; }
    }
  `]
})
export class ValidationComponent implements OnInit {
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);
  private validationService = inject(ValidationService);
  private router = inject(Router);

  // Signals
  loadingCode = signal(false);
  loadingVerify = signal(false);
  message = signal('');
  isError = signal(false);
  codeSent = signal(false);

  validationForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    dni: ['', [Validators.required, AuthValidators.peruvianDNI()]],
    codigo: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit() {
    // PRE-LLENAR EMAIL DE LA SESIÓN AL CARGAR
    const userEmail = this.authService.currentEmail;

    if (userEmail) {
      this.validationForm.patchValue({ email: userEmail });
      // Deshabilitamos el campo para que el usuario no lo altere
      this.validationForm.get('email')?.disable();
    } else {
        this.showMessage("Error: No se pudo obtener el correo de la sesión. Inicie sesión de nuevo.", true);
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.validationForm.get(field);
    return !!(control?.invalid && control?.touched);
  }

  getUserName(): string {
    return this.authService.currentUser()?.nombre || 'Estudiante';
  }

  validarFormatoDni() {
    const dniControl = this.validationForm.get('dni');
    if (dniControl?.valid) {
      this.showMessage('Formato de DNI correcto', false);
    } else {
      this.showMessage('DNI debe tener 8 dígitos numéricos', true);
      dniControl?.markAsTouched();
    }
  }

  // 1. Enviar Código
  enviarCodigo() {
    const emailControl = this.validationForm.get('email');

    const isEmailDisabled = emailControl?.disabled;
    if (isEmailDisabled) emailControl.enable();

    if (emailControl?.invalid) {
      this.showMessage('Ingresa un correo válido (@upc.edu.pe)', true);
      emailControl.markAsTouched();
      if (isEmailDisabled) emailControl.disable(); // Restaurar estado
      return;
    }

    this.loadingCode.set(true);
    this.message.set('');

    const emailValue = emailControl?.value;

    this.validationService.enviarCodigo(emailValue).subscribe({
      next: (res) => {
        this.showMessage('Código enviado. Revisa tu correo.', false);
        this.loadingCode.set(false);
        this.codeSent.set(true);
        if (isEmailDisabled) emailControl.disable(); // Restaurar estado
      },
      error: (err) => {
        console.error(err);
        this.showMessage('Error al enviar. Verifica el correo e intenta de nuevo.', true);
        this.loadingCode.set(false);
        if (isEmailDisabled) emailControl.disable(); // Restaurar estado
      }
    });
  }

  // 2. Verificar Cuenta (DNI + Código)
  verificarCuenta() {
    if (this.validationForm.invalid) {
      this.validationForm.markAllAsTouched();
      this.showMessage('Por favor completa todos los campos correctamente.', true);
      return;
    }

    const userId = this.authService.currentUsuarioId;
    if (!userId) {
      this.showMessage('Sesión no encontrada. Inicia sesión de nuevo.', true);
      return;
    }

    this.loadingVerify.set(true);
    this.message.set('');

    const emailControl = this.validationForm.get('email');
    const isEmailDisabled = emailControl?.disabled;
    if (isEmailDisabled) emailControl.enable();

    const request: ValidacionUsuarioRequest = {
      usuarioId: userId,
      dni: this.validationForm.value.dni,
      codigoVerificacion: this.validationForm.value.codigo
    };

    if (isEmailDisabled) emailControl.disable();

    this.validationService.verificarUsuario(request).subscribe({
      next: (res) => {
        this.showMessage('¡Validación exitosa! Redirigiendo...', false);
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2000);
      },
      error: (err) => {
        console.error(err);
        const msg = err.error?.message || err.error || 'Verificación fallida. Código o DNI incorrectos.';
        this.showMessage(msg, true);
        this.loadingVerify.set(false);
      }
    });
  }

  private showMessage(msg: string, error: boolean) {
    this.message.set(msg);
    this.isError.set(error);
  }
}
