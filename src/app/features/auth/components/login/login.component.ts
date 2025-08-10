import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  // Using inject() is the modern way to get dependencies
  private fb = inject(FormBuilder);
  private router = inject(Router);

  loginForm: FormGroup;
  isLoading = false;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  // Helper getters to easily access form controls in the template
  get emailControl() {
    return this.loginForm.get('email') as FormControl;
  }

  get passwordControl() {
    return this.loginForm.get('password') as FormControl
  }

  login(): void {
    if (this.loginForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    console.log('Form Submitted:', this.loginForm.value);

    // Simulate an API call
    setTimeout(() => {
      this.isLoading = false;
      // On success, you would navigate to the dashboard
      // this.router.navigate(['/dashboard']);
      console.log('Login successful (simulated)');
    }, 2000);
  }
}
