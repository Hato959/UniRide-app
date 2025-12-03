import { Component, inject, OnInit, signal,ViewChild,ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './../../../core/services/auth.service';
import { UserService } from './../../../core/services/user.service';
import { AuthValidators } from './../../auth/validators/auth.validators';
import { UsuarioResponse } from './../../../core/models/user.model';
import { UsuarioRegisterRequest } from './../../../core/models/auth.model';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl:'../../../core/static/edit-profile-component/edit-profile.component.html',
  styleUrl: '../../../core/static/edit-profile-component/edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  usuario = signal<UsuarioResponse | null>(null);
  loading = signal(false);
  errorMessage = signal('');
  loadingPhoto = signal(false);
  photoMessage = signal<string | null>(null);
  photoError = signal(false);

  editForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, AuthValidators.fullName()]],
    carrera: ['', Validators.required],
    distrito: ['', Validators.required],
  });

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const userId = this.authService.currentUsuarioId;
    if (!userId) return;

    this.userService.getProfile(userId).subscribe({
      next: (user) => {
        this.usuario.set(user);
        this.editForm.patchValue({
          nombre: user.nombre,
          carrera: user.carrera,
          distrito: user.distrito,
        });

        if (user.carrera === null) this.editForm.get('carrera')?.patchValue('');
        if (user.distrito === null) this.editForm.get('distrito')?.patchValue('');
      },
      error: (err) => {
        console.error('Error al cargar perfil:', err);
        this.errorMessage.set('No se pudo cargar la información del perfil.');
      }
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.editForm.get(field);
    return !!(control?.invalid && control?.touched);
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;

    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      this.subirFoto(file);
    }
  }

  subirFoto(file: File): void {
    const userId = this.authService.currentUsuarioId;
    if (!userId) {
      this.setPhotoMessage('Error: ID de usuario no encontrado.', true);
      return;
    }

    this.loadingPhoto.set(true);
    this.setPhotoMessage(null, false);

    this.userService.subirFotoPerfil(userId, file).subscribe({
      next: (user) => {
        this.usuario.set(user);
        this.setPhotoMessage('Foto subida con éxito.', false);
        this.loadingPhoto.set(false);
      },
      error: (err) => {
        console.error(err);
        const msg = err.message || 'Error al subir la foto.';
        this.setPhotoMessage(msg, true);
        this.loadingPhoto.set(false);
      }
    });
  }

  private setPhotoMessage(msg: string | null, isError: boolean): void {
      this.photoMessage.set(msg);
      this.photoError.set(isError);
  }

  getInitialLetter(): string {
    const name = this.usuario()?.nombre;
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      this.errorMessage.set('Por favor, completa los campos requeridos correctamente.');
      return;
    }

    const userId = this.authService.currentUsuarioId;
    const currentUserData = this.usuario();

    if (!userId || !currentUserData) return;

    this.loading.set(true);
    this.errorMessage.set('');

    const updateRequest: UsuarioRegisterRequest = {
        ...this.editForm.value,
        correoInstitucional: currentUserData.correoInstitucional,
        dni: currentUserData.dni,
        contrasena: 'PLACEHOLDER',
        rolActivo: currentUserData.rol as any
    };


    this.userService.actualizar(userId, updateRequest).subscribe({
        next: (response) => {
            this.router.navigate(['/perfil']).then(() => {
                console.log('Perfil actualizado con éxito');
            });
        },
        error: (err) => {
            console.error(err);
            this.errorMessage.set(err.message || 'Error al actualizar el perfil.');
            this.loading.set(false);
        }
    });
  }
}
