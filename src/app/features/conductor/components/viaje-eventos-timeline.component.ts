import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { EventoViaje } from '../../../core/models/evento-viaje.model';

@Component({
  selector: 'app-viaje-eventos-timeline',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './viaje-eventos-timeline.component.html',
  styleUrls: ['./viaje-eventos-timeline.component.css']
})
export class ViajeEventosTimelineComponent {
  @Input() eventos: EventoViaje[] = [];

  ordenarPorFecha(eventos: EventoViaje[]): EventoViaje[] {
    return [...(eventos || [])].sort((a, b) => {
      const fa = a.fechaHora ? new Date(a.fechaHora).getTime() : 0;
      const fb = b.fechaHora ? new Date(b.fechaHora).getTime() : 0;
      return fa - fb;
    });
  }

  traducirTipo(tipo: string | undefined): string {
    switch (tipo) {
      case 'INICIO_VIAJE': return 'Inicio del viaje';
      case 'RECOGIO_PASAJERO': return 'Recogió pasajero';
      case 'TERMINO_VIAJE': return 'Fin del viaje';
      default: return tipo || '';
    }
  }
}
