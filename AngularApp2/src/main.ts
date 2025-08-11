import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';          
import { HttpClientModule } from '@angular/common/http';      

import { AppComponent } from './app/app'; 

import { ReservationsListComponent } from './app/reservationList';
import { AddReservationComponent } from './app/addReservation';
import { EditReservationComponent } from './app/editReservation';
import { LockoutLoginComponent } from './app/lockout-login';

import { RegisterComponent } from './app/register';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LockoutLoginComponent  },
  { path: 'register', component: RegisterComponent },
  { path: 'reservations', component: ReservationsListComponent },
  { path: 'add', component: AddReservationComponent },
  { path: 'edit/:id', component: EditReservationComponent },
  { path: '**', redirectTo: 'login' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule)    
  ]
});
