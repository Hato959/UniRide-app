import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header>
        <div class="logo-container">
            <a routerLink="/home" class="logo-link">
                <!-- IMAGEN DEL LOGO -->
                <img src="images/logo-uniride.png" alt="Logo UniRide" class="logo-img">
                <!-- Texto opcional si la imagen ya tiene el texto, bórralo -->
                <span class="brand-name">UNIRIDE</span>
            </a>
        </div>
        <nav class="nav-links">
            <a routerLink="/guia" routerLinkActive="active-link" class="link">Guía UniRide</a>
            <a routerLink="/nosotros" routerLinkActive="active-link" class="link">Nosotros</a>

            <div class="auth-buttons">
                <a routerLink="/auth/login" class="btn-login">Iniciar Sesión</a>
                <a routerLink="/auth/register" class="btn-register">Registrarse</a>
            </div>
        </nav>
    </header>
  `,
  styles: [`
    header {
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 80px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        position: relative;
        z-index: 100;
        padding-right: 40px;
    }

    .logo-container { display: flex; align-items: center; height: 100%; }

    .logo-link {
        display: flex;
        align-items: center;
        text-decoration: none;
        height: 100%;
        gap: 30px;
    }

    /* Estilo para la IMAGEN del logo */
    .logo-img {
        height: 80px; /* Ajusta la altura según tu imagen */
        width: auto;
        object-fit: contain;
    }

    .brand-name {
        color: #D50100;
        font-size: 2rem;
        font-weight: bold;
        letter-spacing: 1px;
    }

    .nav-links { display: flex; gap: 25px; align-items: center; }

    .nav-links a.link {
        color: #333;
        font-weight: 600;
        font-size: 1.1rem;
        transition: color 0.3s;
        text-decoration: none;
    }
    .nav-links a.link:hover, .nav-links a.active-link {
        color: #D50100;
    }

    .auth-buttons { display: flex; gap: 15px; margin-left: 20px; }

    .btn-login {
        border: 2px solid #D50100;
        color: #D50100;
        padding: 8px 20px;
        border-radius: 5px;
        font-weight: bold;
        transition: 0.3s;
        text-decoration: none;
    }
    .btn-login:hover { background: #fff0f0; }

    .btn-register {
        background-color: #D50100;
        color: white;
        padding: 10px 25px;
        border-radius: 5px;
        font-weight: bold;
        transition: 0.3s;
        box-shadow: 0 2px 5px rgba(213, 1, 0, 0.3);
        text-decoration: none;
    }
    .btn-register:hover { background-color: #b00000; transform: translateY(-1px); }

    @media (max-width: 768px) {
        .nav-links { display: none; } /* Ocultar en móvil (pendiente menú hamburguesa) */
    }
  `]
})
export class NavbarLandingComponent {}
