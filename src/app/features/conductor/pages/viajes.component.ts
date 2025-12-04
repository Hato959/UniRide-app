import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Viaje } from '../../../core/models/viaje.model';
import { ViajeService } from '../../../core/services/viaje.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-viajes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './viajes.component.html',
  styleUrls: ['./viajes.component.css']
})
export class ViajesComponent implements OnInit {

  private viajesSrv = inject(ViajeService);
  private router = inject(Router);
  private auth = inject(AuthService);

  viajes = signal<Viaje[]>([]);
  cargando = signal<boolean>(false);
  error = signal<string | null>(null);

  // Formulario de creación de viaje (conductor)
  mostrarFormulario = signal<boolean>(false);
  formViaje = {
    origen: '',
    destino: '',
    fechaSalida: '',
    horaSalida: '',
    asientosDisponibles: 1,
    precio: 0
  };

  readonly rolActual = computed(() => {
    if (this.auth.isConductor) return 'CONDUCTOR';
    if (this.auth.isPasajero) return 'PASAJERO';
    if (this.auth.isAdmin) return 'ADMIN';
    return undefined;
  });
  readonly esConductor = computed(() => this.auth.isConductor);
  readonly esPasajero = computed(() => this.auth.isPasajero);

  ngOnInit(): void {
    this.cargarViajes();
  }

  cargarViajes(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.viajesSrv.listarViajes().subscribe({
      next: (lista) => {
        this.viajes.set(lista);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al listar viajes', err);
        this.error.set('No se pudieron cargar los viajes.');
        this.cargando.set(false);
      }
    });
  }

  toggleFormulario(): void {
    this.mostrarFormulario.update(v => !v);
  }

  crearViaje(): void {
    this.viajesSrv.crearViaje(this.formViaje).subscribe({
      next: (nuevo) => {
        this.viajes.update(lista => [nuevo, ...lista]);
        this.resetForm();
        this.mostrarFormulario.set(false);
      },
      error: (err) => {
        console.error('Error al crear viaje', err);
      }
    });
  }

  resetForm(): void {
    this.formViaje = {
      origen: '',
      destino: '',
      fechaSalida: '',
      horaSalida: '',
      asientosDisponibles: 1,
      precio: 0
    };
  }

  esViajeFinalizado(viaje: Viaje): boolean {
    const estado = (viaje.estado || '').toUpperCase();
    return estado === 'FINALIZADO' || estado === 'TERMINADO' || estado === 'TERMINO_VIAJE';
  }

  verDetalle(viaje: Viaje): void {
    // Si es conductor y el viaje ya terminó, no permitimos editar desde la HU8
    if (this.esConductor() && this.esViajeFinalizado(viaje)) {
      // Aquí podrías mostrar un toast/snackbar
      return;
    }
    this.router.navigate(['/viajes', viaje.idViaje]);
  }
}
