import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Viaje } from '../../../core/models/viaje.model';
import { EventoViaje, TipoEventoViaje } from '../../../core/models/evento-viaje.model';
import { ViajeService } from '../../../core/services/viaje.service';
import { EventoViajeService } from '../../../core/services/evento-viaje.service';
import { AuthService } from '../../../core/services/auth.service';
import { ViajeEventosTimelineComponent } from '../../conductor/components/viaje-eventos-timeline.component';

@Component({
  selector: 'app-viaje-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, ViajeEventosTimelineComponent],
  templateUrl: './viaje-detalle.component.html',
  styleUrls: ['./viaje-detalle.component.css']
})
export class ViajeDetalleComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private viajesSrv = inject(ViajeService);
  private eventosSrv = inject(EventoViajeService);
  private auth = inject(AuthService);

  viaje = signal<Viaje | null>(null);
  eventos = signal<EventoViaje[]>([]);
  cargando = signal<boolean>(false);
  error = signal<string | null>(null);

  readonly rolActual = computed(() => {
    if (this.auth.isConductor) return 'CONDUCTOR';
    if (this.auth.isPasajero) return 'PASAJERO';
    if (this.auth.isAdmin) return 'ADMIN';
    return undefined;
  });
  readonly esConductor = computed(() => this.auth.isConductor);
  readonly esPasajero = computed(() => this.auth.isPasajero);



  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.router.navigate(['/viajes']);
      return;
    }
    const idViaje = Number(idParam);
    this.cargarViajeYEventos(idViaje);
  }

  private cargarViajeYEventos(idViaje: number): void {
    this.cargando.set(true);
    this.error.set(null);

    this.viajesSrv.obtenerViajePorId(idViaje).subscribe({
      next: (v) => this.viaje.set(v),
      error: (err) => {
        console.error('Error al obtener viaje', err);
        this.error.set('No se pudo cargar el viaje.');
      }
    });

    this.eventosSrv.obtenerEventos(idViaje).subscribe({
      next: (lista) => {
        this.eventos.set(lista);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al obtener eventos del viaje', err);
        this.error.set('No se pudieron cargar los eventos.');
        this.cargando.set(false);
      }
    });
  }

  esViajeFinalizado(): boolean {
    const v = this.viaje();
    if (!v) { return false; }
    const estado = (v.estado || '').toUpperCase();
    return estado === 'FINALIZADO' || estado === 'TERMINADO' || estado === 'TERMINO_VIAJE';
  }

  enviarEvento(tipo: TipoEventoViaje): void {
    const v = this.viaje();
    if (!v) { return; }
    if (this.esViajeFinalizado()) {
      return;
    }

    const conductorId = this.auth.currentConductorId ?? this.auth.currentUsuarioId ?? 0;
    const pasajeroId: number | null = this.esConductor() ? null : (this.auth.currentPasajeroId ?? this.auth.currentUsuarioId ?? null);
    let descripcion = '';
    switch (tipo) {
      case 'INICIO_VIAJE':
        descripcion = 'El viaje ha iniciado correctamente.';
        break;
      case 'RECOGIO_PASAJERO':
        descripcion = 'Se registró la recogida de un pasajero.';
        break;
      case 'TERMINO_VIAJE':
        descripcion = 'El viaje ha finalizado correctamente.';
        break;
    }

    this.eventosSrv.crearEvento(v.idViaje, tipo, conductorId, pasajeroId, descripcion).subscribe({
      next: () => this.cargarViajeYEventos(v.idViaje),
      error: (err) => {
        console.error('Error al crear evento del viaje', err);
      }
    });
  }

  volver(): void {
    this.router.navigate(['/viajes']);
  }
}