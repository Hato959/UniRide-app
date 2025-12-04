import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-usuario-viaje',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: '../../../core/static/usuario-viaje-component/usuario-viaje.component.html',
  styleUrl: '../../../core/static/usuario-viaje-component/usuario-viaje.component.css'
})
export class UsuarioViajeComponent { }
