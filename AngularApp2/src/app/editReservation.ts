import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReservationService } from './reservation.service';
import { Reservation } from './reservation';

@Component({
  selector: 'app-editReservation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>Edit Reservation</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input type="hidden" formControlName="id" />
      <label>Name: <input type="text" formControlName="name" /></label><br>
      <label>Area: <input type="text" formControlName="area" /></label><br>
      <label>Date: <input type="date" formControlName="date" /></label><br>
      <label>Time: <input type="time" formControlName="time" /></label><br>
      <label>Photo: <input type="file" (change)="onFileSelected($event)" /></label><br>
      <button type="submit">Save</button>
      <button type="button" (click)="onClose()">Cancel</button>
    </form>
    <p *ngIf="message">{{ message }}</p>
  `
})
export class EditReservationComponent implements OnInit {
  @Input() reservation!: Reservation;
  @Output() close = new EventEmitter<void>();

  form!: FormGroup;
  selectedFile?: File;
  message = '';

  constructor(private fb: FormBuilder, private reservationService: ReservationService) {}

  ngOnInit() {
    this.form = this.fb.group({
      id: [this.reservation.id],
      name: [this.reservation.name, Validators.required],
      area: [this.reservation.area, Validators.required],
      date: [this.reservation.date, Validators.required],
      time: [this.reservation.time, Validators.required],
      image: ['']
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
    formData.append('id', this.form.value.id);
    formData.append('name', this.form.value.name);
    formData.append('area', this.form.value.area);
    formData.append('date', this.form.value.date);
    formData.append('time', this.form.value.time);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.reservationService.editReservation(formData).subscribe({
      next: res => {
        this.message = res.message || 'Reservation updated.';
        this.close.emit();
      },
      error: () => this.message = 'Failed to update reservation.'
    });
  }

  onClose() {
    this.close.emit();
  }
}
