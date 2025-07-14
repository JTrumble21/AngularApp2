import { Component } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { ReservationService } from './reservation.service';
import { Reservation } from './reservation';
import { AddReservationComponent } from './addReservation';
import { EditReservationComponent } from './editReservation';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    AddReservationComponent,
    EditReservationComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  reservations: Reservation[] = [];
  showAddForm = false;
  editingReservation: Reservation | null = null;

  constructor(private reservationService: ReservationService) {
    this.loadReservations();
  }

 loadReservations() {
  this.reservationService.getAll().subscribe({
    next: data => {
      console.log('Reservations loaded:', data);
      this.reservations = data;
    },
    error: err => console.error('Failed to load reservations', err)
  });
}

  getImagePath(image: string): string {
    return `http://localhost/ANGULARAPP2/AngularApp2/reservationapi/${image}`;
  }

  onEdit(reservation: Reservation) {
    this.editingReservation = { ...reservation };
  }

  closeAddForm() {
    this.showAddForm = false;
    this.loadReservations();
  }

  closeEditForm() {
    this.editingReservation = null;
    this.loadReservations();
  }
}
