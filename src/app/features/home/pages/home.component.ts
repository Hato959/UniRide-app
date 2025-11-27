import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: '../../../core/static/home-component/home.component.html',
  styleUrl: '../../../core/static/home-component/home.component.css'
})
export class HomeComponent {

}
