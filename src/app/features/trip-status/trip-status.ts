import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-trip-status',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './trip-status.html',
  styleUrl: './trip-status.css',
})
export class TripStatusComponent {}
