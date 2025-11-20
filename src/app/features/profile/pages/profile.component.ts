import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-page">

      <section class="profile-hero">
        <div class="avatar">
          <i class="fas fa-user-circle"></i>
        </div>
        <div>
          <p class="eyebrow">Tu cuenta</p>
          <h1>Hola, {{ profile()?.nombre || 'Usuario' }}</h1>
          <p class="muted">
            Datos cargados desde la API /usuarios/{{ profile()?.id ?? session()?.usuarioId ?? session()?.id ?? '?' }}
          </p>
        </div>
      </section>

      @if (loading()) {
        <div class="state-card">Cargando tu informacion...</div>
      } @else if (errorMessage()) {
        <div class="state-card error">{{ errorMessage() }}</div>
      } @else {
        <div class="grid">

          <article class="card">
            <header class="card-header">
              <div>
                <p class="eyebrow">Perfil</p>
                <h2>Datos personales</h2>
              </div>
              <span class="badge" [class.badge-ok]="profile()?.verificado">
                {{ profile()?.verificado ? 'Verificado' : 'Pendiente' }}
              </span>
            </header>

            <div class="card-body">
              <div class="data-row">
                <span class="label">Nombre</span>
                <span class="value">{{ profile()?.nombre || 'Sin datos' }}</span>
              </div>
              <div class="data-row">
                <span class="label">Correo institucional</span>
                <span class="value">{{ profile()?.correoInsitucional || 'Sin datos' }}</span>
              </div>
              <div class="data-row">
                <span class="label">Carrera</span>
                <span class="value">{{ profile()?.carrera || 'Sin datos' }}</span>
              </div>
              <div class="data-row">
                <span class="label">Distrito</span>
                <span class="value">{{ profile()?.distrito || 'Sin datos' }}</span>
              </div>
              <div class="data-row">
                <span class="label">DNI</span>
                <span class="value">{{ profile()?.dni || 'Sin datos' }}</span>
              </div>
              <div class="data-row">
                <span class="label">Rol activo</span>
                <span class="value pill">{{ profile()?.rol || 'Sin rol' }}</span>
              </div>
            </div>
          </article>

          <article class="card">
            <header class="card-header">
              <div>
                <p class="eyebrow">Sesion</p>
                <h2>Tus identificadores</h2>
              </div>
              <span class="badge neutral">{{ session()?.rol || 'N/D' }}</span>
            </header>

            <div class="card-body">
              <div class="pill-grid">
                <span class="pill strong">
                  Usuario ID: {{ session()?.usuarioId ?? session()?.id ?? profile()?.id ?? 'N/A' }}
                </span>
                <span class="pill">Conductor ID: {{ session()?.conductorId ?? 'N/A' }}</span>
                <span class="pill">Pasajero ID: {{ session()?.pasajeroId ?? 'N/A' }}</span>
              </div>
              <div class="note">
                Los datos provienen de tu sesion actual y del perfil almacenado en la API.
              </div>
            </div>
          </article>

        </div>
      }
    </div>
  `,
  styles: [`
    .profile-page {
      padding: 40px 24px 80px;
      max-width: 1200px;
      margin: 0 auto;
      color: #1f1f1f;
    }

    .profile-hero {
      background: linear-gradient(120deg, #ffeded 0%, #fff 60%);
      border: 1px solid #ffe0e0;
      border-radius: 16px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      box-shadow: 0 6px 18px rgba(0,0,0,0.05);
    }

    .avatar {
      width: 64px;
      height: 64px;
      border-radius: 14px;
      background: #d5010020;
      display: grid;
      place-items: center;
    }

    .avatar i {
      font-size: 2.6rem;
      color: var(--primary-red);
    }

    .eyebrow {
      text-transform: uppercase;
      letter-spacing: 1.8px;
      font-size: 0.75rem;
      color: #9a9a9a;
      margin: 0 0 4px;
    }

    h1 {
      margin: 0 0 6px;
      font-size: 1.8rem;
      color: #b00000;
    }

    h2 {
      margin: 2px 0 0;
      font-size: 1.35rem;
      color: #1f1f1f;
    }

    .muted {
      margin: 0;
      color: #666;
      font-size: 0.95rem;
    }

    .state-card {
      background: #fff;
      border-radius: 14px;
      padding: 18px 16px;
      box-shadow: 0 6px 18px rgba(0,0,0,0.05);
      border: 1px solid #eaeaea;
      color: #444;
    }

    .state-card.error {
      color: #b00000;
      border-color: #ffd4d4;
      background: #fff5f5;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 18px;
    }

    .card {
      background: #fff;
      border-radius: 16px;
      border: 1px solid #e9e9e9;
      box-shadow: 0 8px 20px rgba(0,0,0,0.05);
      overflow: hidden;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 20px 10px;
      gap: 12px;
    }

    .card-body {
      padding: 10px 20px 22px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .badge {
      font-size: 0.8rem;
      padding: 6px 12px;
      border-radius: 999px;
      background: #fff3cd;
      color: #856404;
      border: 1px solid #ffe7a3;
      white-space: nowrap;
    }

    .badge-ok {
      background: #e3f6ed;
      color: #0f7b3f;
      border-color: #c9eed8;
    }

    .badge.neutral {
      background: #eef1ff;
      color: #2431a8;
      border-color: #d7ddff;
    }

    .data-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 4px;
      border-bottom: 1px dashed #efefef;
      gap: 14px;
    }

    .data-row:last-child {
      border-bottom: none;
    }

    .label {
      color: #777;
      font-size: 0.95rem;
    }

    .value {
      color: #1f1f1f;
      font-weight: 600;
      font-size: 1rem;
    }

    .pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      border-radius: 12px;
      background: #f4f4f4;
      color: #333;
      font-size: 0.9rem;
    }

    .pill.strong {
      background: #d5010010;
      color: #b00000;
      border: 1px solid #ffd8d6;
    }

    .pill-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 10px;
    }

    .note {
      margin-top: 10px;
      font-size: 0.9rem;
      color: #666;
    }

    @media (max-width: 700px) {
      .profile-page { padding: 24px 16px 60px; }
      .profile-hero { flex-direction: column; align-items: flex-start; }
      .card-header { flex-direction: column; align-items: flex-start; }
      .data-row { flex-direction: column; align-items: flex-start; }
    }
  `]
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);

  loading = signal(true);
  errorMessage = signal('');

  profile = this.userService.userProfile;
  session = this.authService.currentUser;

  ngOnInit(): void {
    const userId = this.authService.currentUsuarioId;

    if (userId == null) {
      this.errorMessage.set('No encontramos una sesion activa.');
      this.loading.set(false);
      return;
    }

    this.userService.getProfile(userId).subscribe({
      next: () => this.loading.set(false),
      error: () => {
        this.errorMessage.set('No se pudo cargar tu informacion de usuario.');
        this.loading.set(false);
      }
    });
  }
}
