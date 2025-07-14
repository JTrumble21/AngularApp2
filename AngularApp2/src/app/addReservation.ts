import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservationService } from './reservation.service';

@Component({
  selector: 'app-addReservation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-container">
      <h2>Add Reservation</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <label>Name: <input formControlName="name" /></label>
        <label>Area: <input formControlName="area" /></label>
        <label>Date: <input type="date" formControlName="date" /></label>
        <label>Time: <input type="time" formControlName="time" /></label>
        <label>Photo: <input type="file" (change)="onFileSelected($event)" /></label>
        <button type="submit" [disabled]="form.invalid">Add</button>
      </form>
      <button (click)="close()">Cancel</button>
      <div *ngIf="message">{{ message }}</div>
    </div>
  `
})
export class AddReservationComponent {
  form: FormGroup;
  selectedFile?: File;
  message = '';

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      area: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required]
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const formData = new FormData();
    formData.append('name', this.form.value.name);
    formData.append('area', this.form.value.area);
    formData.append('date', this.form.value.date);
    formData.append('time', this.form.value.time);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }
    this.reservationService.addReservation(formData).subscribe({
      next: () => this.close(),
      error: () => this.message = 'Error adding reservation'
    });
  }

  close(): void {
    const closeEvent = new CustomEvent('close');
    dispatchEvent(closeEvent);
  }
}
