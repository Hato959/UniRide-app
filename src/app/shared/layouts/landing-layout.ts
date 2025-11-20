import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from './../../shared/components/footer';
import { NavbarLandingComponent } from '../components/navbar-landing.component';

@Component({
  selector: 'app-landing-layout',
  standalone: true,
  // 2. CAMBIO: Lo agregamos a los imports
  imports: [CommonModule, RouterOutlet, NavbarLandingComponent, FooterComponent],
  template: `
    <div class="layout-container">
      <app-navbar-landing></app-navbar-landing>

      <main>
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
    main {
      flex: 1;
      background-color: #BFBFBF;
    }
  `]
})
export class LandingLayoutComponent {}
