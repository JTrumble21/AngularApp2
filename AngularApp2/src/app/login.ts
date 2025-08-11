import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  template: `
    <div class="login-container">
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <h2>Employee Login</h2>
        <label>
          Employee Number:
          <input type="text" formControlName="employeeNumber" />
        </label>
        <label>
          Password:
          <input type="password" formControlName="password" />
        </label>
        <button type="submit" [disabled]="loginForm.invalid">Login</button>
      </form>

      <button class="register-btn" (click)="goToRegister()">Register New Employee</button>

      <p *ngIf="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      employeeNumber: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { employeeNumber, password } = this.loginForm.value;

      this.http.post<{ success: boolean; message?: string }>(
  'http://localhost/AngularApp2/AngularApp2/reservationapi/login.php',
  { employeeNumber, password }
)
      .subscribe(response => {
        if (response.success) {
          this.router.navigate(['/reservations']);
        } else {
          this.errorMessage = response.message || 'Login failed.';
        }
      }, error => {
        this.errorMessage = 'Server error. Please try again.';
      });
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
