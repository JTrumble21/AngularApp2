import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { provideRouter, Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { ReservationsListComponent } from './app/reservationList';
import { AddReservationComponent } from './app/addReservation';
import { EditReservationComponent } from './app/editReservation';

const routes: Routes = [
  { path: '', component: ReservationsListComponent },
  { path: 'add', component: AddReservationComponent },
  { path: 'edit/:id', component: EditReservationComponent }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule)
  ]
});
