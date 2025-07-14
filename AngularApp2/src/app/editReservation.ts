import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservationService } from './reservation.service';
import { Reservation } from './reservation';

@Component({
  selector: 'app-editReservation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-container">
      <h2>Edit Reservation</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <input type="hidden" formControlName="id" />
        <label>Name: <input formControlName="name" /></label>
        <label>Area: <input formControlName="area" /></label>
        <label>Date: <input type="date" formControlName="date" /></label>
        <label>Time: <input type="time" formControlName="time" /></label>
        <label>Photo: <input type="file" (change)="onFileSelected($event)" /></label>
        <button type="submit" [disabled]="form.invalid">Update</button>
      </form>
      <button (click)="close()">Cancel</button>
      <div *ngIf="message">{{ message }}</div>
    </div>
  `
})
export class EditReservationComponent implements OnInit {
  @Input() reservation!: Reservation;
  form!: FormGroup;
  selectedFile?: File;
  message = '';

  constructor(private fb: FormBuilder, private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.reservation.id],
      name: [this.reservation.name, Validators.required],
      area: [this.reservation.area, Validators.required],
      date: [this.reservation.date, Validators.required],
      time: [this.reservation.time, Validators.required]
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('id', this.form.value.id);
    formData.append('name', this.form.value.name);
    formData.append('area', this.form.value.area);
    formData.append('date', this.form.value.date);
    formData.append('time', this.form.value.time);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }
    this.reservationService.editReservation(formData).subscribe({
      next: () => this.close(),
      error: () => this.message = 'Error updating reservation'
    });
  }

  close(): void {
    const closeEvent = new CustomEvent('close');
    dispatchEvent(closeEvent);
  }
}
