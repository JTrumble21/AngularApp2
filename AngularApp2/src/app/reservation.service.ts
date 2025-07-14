import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from './reservation';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost/ANGULARAPP2/AngularApp2/reservationapi';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/getReservation.php`);
  }

  addReservation(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/insertReservation.php`, formData);
  }

  editReservation(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/editReservation.php`, formData);
  }
}
