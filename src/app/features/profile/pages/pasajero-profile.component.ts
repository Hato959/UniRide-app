import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from './../../../core/services/auth.service';
import { UserService } from './../../../core/services/user.service';
import { PasajeroService } from './../../../core/services/passenger.service';
import { UsuarioResponse } from './../../../core/models/user.model';
import { PasajeroResponse, PasajeroRequest } from './../../../core/models/passenger.model';
import { NavbarUserComponent } from './../../../shared/components/navbar-user.component';

@Component({
  selector: 'app-pasajero-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, NavbarUserComponent],
  templateUrl: '../../../core/static/pasajero-profile-component/pasajero-profile.component.html',
  styleUrl: '../../../core/static/pasajero-profile-component/pasajero-profile.component.css'
})

export class PasajeroProfileComponent implements OnInit {
  // Signals para el estado de los datos
  usuario = signal<UsuarioResponse | null>(null);
  preferencias = signal<PasajeroResponse | null>(null);
  isLoading = signal(true);
  isEditingPreferences = signal(false);
  loadingSave = signal(false);
  prefMessage = signal<string | null>(null);
  isPrefError = signal(false);

  constructor(private router: Router) {
    console.log('Router config:', this.router.config);
    console.log('Router paths:', this.router.config.map(r => r.path));
  }


  // Formularios
  private fb = inject(FormBuilder);
  preferencesForm: FormGroup = this.fb.group({
    preferencias: ['', Validators.required]
  });

  authService = inject(AuthService);
  private userService = inject(UserService);
  private pasajeroService = inject(PasajeroService);

  ngOnInit(): void {
    this.loadProfileData();
  }

  isFieldInvalid(field: string): boolean {
    const control = this.preferencesForm.get(field);
    return !!(control?.invalid && control?.touched);
  }

  loadProfileData(): void {
    const usuarioId = this.authService.currentUsuarioId;
    const pasajeroId = this.authService.currentPasajeroId;

    if (!usuarioId) {
      console.error('No se pudo obtener el ID del usuario.');
      this.isLoading.set(false);
      return;
    }

    this.userService.getProfile(usuarioId).subscribe({
      next: (user: UsuarioResponse) => {
        this.usuario.set(user);
      },
      error: (err) => {
        console.error('Error al cargar perfil de usuario:', err);
      }
    });

    if (pasajeroId) {
      this.pasajeroService.obtener(pasajeroId).subscribe({
        next: (pref: PasajeroResponse) => {
            this.preferencias.set(pref);
        },
        error: (err) => console.error('Error al cargar preferencias del pasajero:', err),
        complete: () => this.isLoading.set(false)
      });
    } else {
        this.isLoading.set(false);
    }
  }

  editPreferences(): void {

  }

  savePreferences(): void {

    if (this.preferencesForm.invalid) {
      this.preferencesForm.markAllAsTouched();
      return;
    }

    const pasajeroId = this.authService.currentPasajeroId;
    const usuarioId = this.authService.currentUsuarioId;
    if (!usuarioId) {
        this.showMessage('Error de sesión: ID de usuario no encontrado.', true);
        return;
    }

    this.loadingSave.set(true);
    this.prefMessage.set(null);

    const data: PasajeroRequest = {
        usuarioId: usuarioId,
        preferencias: this.preferencesForm.value.preferencias
    };

    let saveOperation: Observable<PasajeroResponse>;

    if (pasajeroId) {

        saveOperation = this.pasajeroService.actualizar(pasajeroId, data);
    } else {

        saveOperation = this.pasajeroService.registrar(data);
    }

    saveOperation.subscribe({
        next: (updatedPref) => {

            if (!pasajeroId) {
                this.authService.updatePasajeroId(updatedPref.id);
            }

            this.preferencias.set(updatedPref);
            this.showMessage('Preferencias actualizadas con éxito.', false);
            this.loadingSave.set(false);
            this.isEditingPreferences.set(false);
        },
        error: (err) => {
            console.error(err);
            const msg = err.message || 'Error al guardar las preferencias.';
            this.showMessage(msg, true);
            this.loadingSave.set(false);
        }
    });
  }

  private showMessage(msg: string, error: boolean): void {
    this.prefMessage.set(msg);
    this.isPrefError.set(error);
  }

  getInitialLetter(): string {
    const name = this.usuario()?.nombre;
    return name ? name.charAt(0).toUpperCase() : '?';
  }

}
