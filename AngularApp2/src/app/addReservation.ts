import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReservationService } from './reservation.service';

@Component({
  selector: 'app-addReservation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>Add Reservation</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <label>Name: <input type="text" formControlName="name" /></label><br />
      <label>Phone: <input type="text" formControlName="phone" /></label><br />
      <label>Area:
        <select formControlName="area">
          <option value="">Select Area</option>
          <option value="Cedar Ridge">Cedar Ridge</option>
          <option value="Lake Nibi">Lake Nibi</option>
          <option value="Redbird Meadow">Redbird Meadow</option>
          <option value="Birchwood Trails">Birchwood Trails</option>
        </select>
      </label><br />
      <label>Date: <input type="date" formControlName="date" /></label><br />
      <label>Time: <input type="time" formControlName="time" /></label><br />
      <label>Photo: <input type="file" (change)="onFileSelected($event)" /></label><br />
      <button type="submit" [disabled]="form.invalid">Add</button>
      <button type="button" (click)="router.navigate(['/'])">Cancel</button>
    </form>
    <p *ngIf="message">{{ message }}</p>
  `
})
export class AddReservationComponent {
  form: FormGroup;
  selectedFile?: File;
  message = '';

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    public router: Router
  ) {
    this.form = this.fb.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],    
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
    if (this.form.invalid) return;

  const formData = new FormData();
  formData.append('name', this.form.value.name);
  formData.append('phone', this.form.value.phone);
  formData.append('area', this.form.value.area);
  formData.append('date', this.form.value.date);
  formData.append('time', this.form.value.time);
  if (this.selectedFile) {
  formData.append('image', this.selectedFile);
}


    this.reservationService.addReservation(formData).subscribe({
      next: (res) => {
        this.message = res.message || 'Reservation added.';
        setTimeout(() => this.router.navigate(['/']), 1000);
      },
      error: (err) => {
        this.message = err.error?.message || 'Failed to add reservation.';
        console.error('Add reservation error:', err);
      }
    });
  }
}
