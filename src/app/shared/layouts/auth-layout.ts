import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

// 1. Importamos el AuthService para saber el rol
import { AuthService } from './../../core/services/auth.service';

// 2. Importamos los componentes que vamos a usar
import { NavbarUserComponent } from './../../shared/components/navbar-user.component';
import { NavbarAdminComponent } from './../../shared/components/navbar-admin.component';
import { FooterComponent } from './../../shared/components/footer';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarUserComponent,
    NavbarAdminComponent,
    FooterComponent
  ],
  template: `
    <div class="layout-container">

      @if (authService.isAdmin) {
        <app-navbar-admin></app-navbar-admin>
      }
      @else {
        <app-navbar-user></app-navbar-user>
      }

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .layout-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .main-content {
      flex: 1;
      background-color: #f8f9fa;
      padding-top: 80px;
    }


    @media (max-width: 768px) {
      .main-content {
        padding-top: 70px;
      }
    }
  `]
})
export class AuthLayoutComponent {
  // Inyectamos el servicio para poder usar 'authService.isAdmin' en el HTML
  authService = inject(AuthService);
}
