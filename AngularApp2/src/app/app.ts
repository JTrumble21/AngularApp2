// src/app/app.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { Reservation } from './reservation';
import { ReservationService } from './reservation.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit {
  reservations: Reservation[] = [];
  error = '';
  success = '';

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.reservationService.getAll().subscribe(
      (data) => {
        this.reservations = data;
        this.success = 'Reservations loaded successfully.';
        this.error = '';
      },
      (err) => {
        console.error(err);
        this.error = 'Failed to load reservations.';
        this.success = '';
      }
    );
  }
}
