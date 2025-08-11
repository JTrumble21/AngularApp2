import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-lockout-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  template: `
    <div class="login-container">
      <form *ngIf="!isLockedOut" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
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

      <div *ngIf="isLockedOut" class="lockout-message">
        <p>You have been locked out due to multiple failed login attempts.</p>
        <p>Please wait {{ lockoutCountdown }} seconds before trying again.</p>
      </div>

      <button class="register-btn" (click)="goToRegister()" [disabled]="isLockedOut">Register New Employee</button>

      <p *ngIf="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  `
})
export class LockoutLoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage = '';
  isLockedOut = false;
  lockoutCountdown = 0;

  private LOCKOUT_KEY = 'loginLockout';
  private ATTEMPTS_KEY = 'loginAttempts';
  private LOCKOUT_TIME_MS = 3 * 60 * 1000; // 3 minutes

  private countdownInterval: any;

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

  ngOnInit() {
    this.checkLockout();
  }

  checkLockout() {
    const lockoutUntil = localStorage.getItem(this.LOCKOUT_KEY);
    if (lockoutUntil) {
      const lockoutTime = parseInt(lockoutUntil, 10);
      const now = Date.now();

      if (now < lockoutTime) {
        this.isLockedOut = true;
        this.lockoutCountdown = Math.floor((lockoutTime - now) / 1000);
        this.startCountdown(lockoutTime);
      } else {
        this.clearLockout();
      }
    }
  }

  startCountdown(lockoutTime: number) {
    this.countdownInterval = setInterval(() => {
      const now = Date.now();
      if (now >= lockoutTime) {
        this.clearLockout();
      } else {
        this.lockoutCountdown = Math.floor((lockoutTime - now) / 1000);
      }
    }, 1000);
  }

  clearLockout() {
    this.isLockedOut = false;
    this.lockoutCountdown = 0;
    localStorage.removeItem(this.LOCKOUT_KEY);
    localStorage.removeItem(this.ATTEMPTS_KEY);
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  onSubmit() {
    if (this.isLockedOut) {
      return;
    }

    if (this.loginForm.valid) {
      const { employeeNumber, password } = this.loginForm.value;

      this.http.post<{ success: boolean; message?: string }>(
        'http://localhost/AngularApp2/AngularApp2/reservationapi/login.php',
        { employeeNumber, password }
      ).subscribe({
        next: (response) => {
          if (response.success) {
            this.clearLockout();
            this.router.navigate(['/reservations']);
          } else {
            this.errorMessage = response.message || 'Login failed.';
            this.incrementAttempts();
          }
        },
        error: (error) => {
          if (error.status === 401 && error.error) {
            // Show error message from backend on invalid credentials
            this.errorMessage = error.error.message || 'Invalid employee number or password.';
            this.incrementAttempts();
          } else {
            this.errorMessage = 'Server error. Please try again.';
          }
        }
      });
    }
  }

  incrementAttempts() {
    let attempts = parseInt(localStorage.getItem(this.ATTEMPTS_KEY) || '0', 10);
    attempts++;
    localStorage.setItem(this.ATTEMPTS_KEY, attempts.toString());

    if (attempts >= 3) {
      const lockoutUntil = Date.now() + this.LOCKOUT_TIME_MS;
      localStorage.setItem(this.LOCKOUT_KEY, lockoutUntil.toString());
      this.checkLockout();
    }
  }

  goToRegister() {
    if (!this.isLockedOut) {
      this.router.navigate(['/register']);
    }
  }
}
