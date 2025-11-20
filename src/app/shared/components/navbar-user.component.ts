import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './../../core/services/auth.service';

@Component({
  selector: 'app-navbar-user',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">

      <div class="brand-area">
        <div class="red-square">
          <i class="fas fa-grip-lines-vertical pole"></i>
          <i class="fas fa-car-side car-icon"></i>
          <i class="fas fa-grip-lines-vertical pole"></i>
        </div>

        <div class="brand-text-container">
          <a routerLink="/home" class="brand-name">UNIRIDE</a>
          <span class="role-label">{{ authService.currentUser()?.rol }}</span>
        </div>
      </div>

      <div class="icons-area">

        @if (authService.isConductor) {
          <a routerLink="/crear-viaje" routerLinkActive="active" title="Publicar Viaje">
            <i class="fas fa-car"></i>
          </a>
        } @else {
          <a routerLink="/buscar-viaje" routerLinkActive="active" title="Buscar Auto">
            <i class="fas fa-car"></i>
          </a>
        }

        <a routerLink="/perfil" routerLinkActive="active" title="Mi Perfil">
          <i class="fas fa-user"></i>
        </a>

        <a routerLink="/home" title="Explorar">
          <i class="fas fa-search"></i>
        </a>

        <a routerLink="/notificaciones" routerLinkActive="active" title="Notificaciones">
          <i class="fas fa-bell"></i>
        </a>

        <button (click)="logout()" class="text-logout" title="Salir">
          <i class="fas fa-power-off"></i>
        </button>

      </div>
    </nav>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .navbar {
      height: 70px;
      background-color: white;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
      padding-right: 30px;
    }

    /* --- IZQUIERDA --- */
    .brand-area {
      display: flex;
      align-items: center;
      height: 100%;
      gap: 15px;
    }

    .red-square {
      background-color: #D50100;
      height: 100%;
      width: 90px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      color: white;
      font-size: 1.5rem;
    }

    .pole { font-size: 1rem; opacity: 0.7; }
    .car-icon { font-size: 1.8rem; }

    .brand-text-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .brand-name {
      color: #D50100;
      font-family: 'Roboto', sans-serif;
      font-weight: 700;
      font-size: 1.8rem;
      text-decoration: none;
      letter-spacing: 0.5px;
      line-height: 1;
    }

    .role-label {
      color: #666;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-top: 2px;
    }

    /* --- DERECHA (ICONOS) --- */
    .icons-area {
      display: flex;
      align-items: center;
      gap: 25px;
    }

    .icons-area a {
      color: #D50100;
      font-size: 1.4rem;
      text-decoration: none;
      transition: transform 0.2s, opacity 0.2s;
      display: flex;
      align-items: center;
    }

    .icons-area a:hover {
      transform: scale(1.1);
      opacity: 0.8;
    }

    .icons-area a.active {
      border-bottom: 2px solid #D50100;
    }

    /* Estilo discreto para el botón de salir (extra) */
    .text-logout {
      background: none;
      border: none;
      color: #999;
      font-size: 1rem;
      cursor: pointer;
      margin-left: 10px;
      transition: color 0.2s;
    }
    .text-logout:hover {
      color: #D50100;
    }

    @media (max-width: 600px) {
      .brand-name { font-size: 1.4rem; }
      .red-square { width: 70px; }
      .icons-area { gap: 15px; }
      .role-label { display: none; }
    }
  `]
})
export class NavbarUserComponent {
  authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
