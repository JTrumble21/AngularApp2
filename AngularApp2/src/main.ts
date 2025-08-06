import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app'; 

import { ReservationsListComponent } from './app/reservationList';
import { AddReservationComponent } from './app/addReservation';
import { EditReservationComponent } from './app/editReservation';
import { LoginComponent } from './app/login';
import { RegisterComponent } from './app/register';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reservations', component: ReservationsListComponent },
  { path: 'add', component: AddReservationComponent },
  { path: 'edit/:id', component: EditReservationComponent },
  { path: '**', redirectTo: 'login' }
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
});
