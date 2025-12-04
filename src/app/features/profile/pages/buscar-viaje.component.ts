import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-buscar-viaje',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: '../../../core/static/buscar-viaje-component/buscar-viaje.component.html',
  styleUrl: '../../../core/static/buscar-viaje-component/buscar-viaje.component.css'
})
export class BuscarViajeComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      origen: ['', Validators.required],
      destino: ['', Validators.required]
    });
  }

  buscar(): void {
    // Placeholder submit action until real logic is provided
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Buscar viaje', this.form.value);
  }
}
