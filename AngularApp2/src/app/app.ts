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
    HttpClientModule  // <-- add this here
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  reservations: Reservation[] = [];

  constructor(private reservationService: ReservationService) {}

  ngOnInit() {
    this.reservationService.getAll().subscribe(data => {
      this.reservations = data;
    });
  }
}
