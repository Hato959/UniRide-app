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
  templateUrl: '../../../core/static/validation-component/validation.component.html',
  styleUrl: '../../../core/static/validation-component/validation.component.css'
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
        this.authService.updateVerificationStatus(true);
        const rol = this.authService.currentUser()?.rol;
        setTimeout(() => {
          if (rol) {
             this.authService.navigateToProfile(rol);
          } else {
             this.router.navigate(['/home']);
          }
        }, 2000);
      },
      error: (err) => {
        console.error(err);
        const msg = err.error?.message || err.error || 'Verificación fallida. Código o DNI incorrectos.';
        this.showMessage(msg, true);
        this.loadingVerify.set(false);
        if (isEmailDisabled) emailControl?.disable();
      }
    });
  }

  private showMessage(msg: string, error: boolean) {
    this.message.set(msg);
    this.isError.set(error);
  }
}
