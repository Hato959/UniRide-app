import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: '../../core/static/navbar-admin-component/navbar-admin.component.html',
  styleUrl: '../../core/static/navbar-admin-component/navbar-admin.component.css'
})
export class NavbarAdminComponent {
  authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
