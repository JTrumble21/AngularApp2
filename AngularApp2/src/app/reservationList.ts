import { Component } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReservationService } from './reservation.service';
import { Reservation } from './reservation';

@Component({
  selector: 'app-reservations-list',
  standalone: true,
  imports: [CommonModule, NgFor, RouterModule],
  template: `
    <div class="table-container">
      <h1>Canada Parks Reservation List</h1>

      <a routerLink="/add" class="add-btn">Add New Reservation</a>
      <button (click)="goToAboutUs()" class="about-button">About Us</button>
      <p>Number of reservations: {{ reservations.length }}</p>

      <table>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Phone</th><th>Area</th><th>Date</th><th>Time</th><th>Photo</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let res of reservations">
            <td>{{ res.id }}</td>
            <td>{{ res.name }}</td>
            <td>{{ res.phone }}</td>
            <td>{{ res.area }}</td>
            <td>{{ res.date }}</td>
            <td>{{ formatTime(res.time) }}</td>
            <td>
              <img [src]="res.image || placeholder" alt="Photo" class="thumbnail" />
            </td>
            <td>
              <a [routerLink]="['/edit', res.id]">Edit</a>
              &nbsp;|&nbsp;
              <button (click)="deleteReservation(res.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styleUrls: ['./angular.css']
})
export class ReservationsListComponent {
  reservations: Reservation[] = [];
  placeholder = 'http://localhost/ANGULARAPP2/AngularApp2/reservationapi/uploads/placeholder.jpeg';

  constructor(private reservationService: ReservationService) {
    this.loadReservations();
  }

  loadReservations() {
    this.reservationService.getAll().subscribe({
      next: (data) => this.reservations = data,
      error: (err) => console.error('Failed to load reservations', err)
    });
  }

  deleteReservation(id: number) {
    if (confirm('Are you sure you want to delete this reservation?')) {
      this.reservationService.deleteReservation(id).subscribe({
        next: res => {
          alert(res.message);
          this.loadReservations();
        },
        error: err => {
          alert('Failed to delete reservation.');
          console.error(err);
        }
      });
    }
  }

  formatTime(time24: string): string {
    if (!time24) return '';
    const [hourStr, minute] = time24.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour}:${minute} ${ampm}`;
  }

  goToAboutUs(): void {
    window.location.href = 'http://localhost/ANGULARAPP2/AngularApp2/reservationapi/aboutUs.php';
  }
}
