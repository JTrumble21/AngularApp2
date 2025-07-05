import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReservationService } from './reservation.service';
import { Reservation } from './reservation';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  reservations: Reservation[] = [];
  success: string = '';
  error: string = '';

  constructor(private reservationService: ReservationService) {}

  ngOnInit() {
    this.reservationService.getAll().subscribe({
      next: (data: Reservation[]) => {
        this.reservations = data;
        this.success = 'Reservations loaded successfully.';
        // Optionally clear the success message after a few seconds
        setTimeout(() => this.success = '', 4000);
      },
      error: (err) => {
        this.error = 'Failed to load reservations.';
        console.error(err);
        // Optionally clear the error message after a few seconds
        setTimeout(() => this.error = '', 4000);
      }
    });
  }
}

