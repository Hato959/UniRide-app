import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './../../core/services/auth.service';

@Component({
  selector: 'app-navbar-user',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: '../../core/static/navbar-user-component/navbar-user.component.html',
  styleUrl: '../../core/static/navbar-user-component/navbar-user.component.css'
})
export class NavbarUserComponent {
  authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
