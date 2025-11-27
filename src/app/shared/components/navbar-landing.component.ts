import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: '../../core/static/navbar-landing-component/navbar-landing.component.html',
  styleUrl: '../../core/static/navbar-landing-component/navbar-landing.component.css'
})
export class NavbarLandingComponent {}
