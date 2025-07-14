import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReservationService } from './reservation.service';

@Component({
  selector: 'app-addReservation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>Add Reservation</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <label>Name: <input type="text" formControlName="name"></label><br>
      <label>Area: <input type="text" formControlName="area"></label><br>
      <label>Date: <input type="date" formControlName="date"></label><br>
      <label>Time: <input type="time" formControlName="time"></label><br>
      <label>Photo: <input type="file" (change)="onFileSelected($event)"></label><br>
      <button type="submit" [disabled]="form.invalid">Add</button>
      <button type="button" (click)="onClose()">Cancel</button>
    </form>
    <p *ngIf="message">{{ message }}</p>
  `
})
export class AddReservationComponent {
  @Output() close = new EventEmitter<void>();
  form: FormGroup;
  selectedFile?: File;
  message = '';

  constructor(private fb: FormBuilder, private reservationService: ReservationService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      area: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required]
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.form.value.name);
    formData.append('area', this.form.value.area);
    formData.append('date', this.form.value.date);
    formData.append('time', this.form.value.time);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.reservationService.addReservation(formData).subscribe({
      next: res => {
        this.message = res.message || 'Reservation added.';
        this.close.emit();
      },
      error: () => this.message = 'Failed to add reservation.'
    });
  }

  onClose() {
    this.close.emit();
  }
}
