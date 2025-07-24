import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from './reservation.service';
import { Reservation } from './reservation';

@Component({
  selector: 'app-editReservation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>Edit Reservation</h2>
    <form *ngIf="form" [formGroup]="form" (ngSubmit)="onSubmit()">
      <label>Name: <input type="text" formControlName="name" /></label><br />
      <label>Area:
      <select formControlName="area">
      <option value="">Select an area</option>
      <option value="Cedar Ridge">Cedar Ridge</option>
      <option value="Lake Nibi">Lake Nibi</option>
      <option value="Redbird Meadow">Redbird Meadow</option>
      <option value="Birchwood Trails">Birchwood Trails</option>
      </select>
      </label><br />
      <label>Date: <input type="date" formControlName="date" /></label><br />
      <label>Time: <input type="time" formControlName="time" /></label><br />
      <label>Photo: <input type="file" (change)="onFileSelected($event)" /></label><br />
      <button type="submit">Save</button>
      <button type="button" (click)="cancel()">Cancel</button>
    </form>
    <p *ngIf="message">{{ message }}</p>
  `
})
export class EditReservationComponent implements OnInit {
  form!: FormGroup;
  selectedFile?: File;
  message = '';
  reservationId!: number;

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.reservationId = +idParam;
        this.loadReservation(this.reservationId);
      }
    });
  }

  loadReservation(id: number) {
    this.reservationService.getById(id).subscribe({
      next: (res: Reservation) => {
        this.form = this.fb.group({
          id: [res.id],
          name: [res.name, Validators.required],
          area: [res.area, Validators.required],
          date: [res.date, Validators.required],
          time: [res.time, Validators.required],
          image: ['']
        });
      },
      error: () => {
        this.message = 'Failed to load reservation';
      }
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
    formData.append('id', String(this.form.value.id)); // ✅ Fix: Convert to string
    formData.append('name', this.form.value.name);
    formData.append('area', this.form.value.area);
    formData.append('date', this.form.value.date);
    formData.append('time', this.form.value.time);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.reservationService.editReservation(formData).subscribe({
      next: (res) => {
        this.message = res.message || 'Reservation updated.';
        setTimeout(() => this.router.navigateByUrl('/'), 1000);
      },
      error: () => {
        this.message = 'Failed to update reservation.';
      }
    });
  }

  cancel() {
    this.router.navigateByUrl('/');
  }
}
