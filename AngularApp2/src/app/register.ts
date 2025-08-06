import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  template: `
    <div class="register-container">
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <h2>Register New Employee</h2>

        <label>
          Name:
          <input type="text" formControlName="name" />
        </label>
        <label>
          Status:
          <input type="text" formControlName="status" />
        </label>
        <label>
          Employee Number:
          <input type="text" formControlName="employeeNumber" />
        </label>
        <label>
          Password:
          <input type="password" formControlName="password" />
        </label>

        <button type="submit" [disabled]="registerForm.invalid">Register</button>
      </form>

      <button class="back-btn" (click)="goToLogin()">Back to Login</button>

      <p *ngIf="errorMessage" class="error">{{ errorMessage }}</p>
      <p *ngIf="successMessage" class="success">{{ successMessage }}</p>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      status: ['', Validators.required],
      employeeNumber: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

      this.http.post<{ success: boolean; message?: string }>(
        'http://localhost/ANGULARAPP2/AngularApp2/reservationapi/register.php',
        JSON.stringify(formData),
        { headers }
      ).subscribe(response => {
        if (response.success) {
          this.successMessage = 'Registration successful!';
          this.registerForm.reset();
          this.errorMessage = '';
        } else {
          this.errorMessage = response.message || 'Registration failed.';
          this.successMessage = '';
        }
      }, () => {
        this.errorMessage = 'Server error. Please try again.';
        this.successMessage = '';
      });
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
