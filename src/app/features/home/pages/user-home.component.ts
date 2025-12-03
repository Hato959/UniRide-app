import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: '../../../core/static/user-home-component/user-home.component.html',
  styleUrl: '../../../core/static/user-home-component/user-home.component.css'
})
export class HomeComponent {

}
