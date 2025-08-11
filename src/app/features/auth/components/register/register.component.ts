import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectAuthIsLoading } from '../../store/auth.reducer';
import { AuthActions } from '../../store/auth.actions';

// Custom validator to check if two fields match
export function passwordMatchValidator(controlName: string, matchingControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): { [key: string]: any } | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);
    if (matchingControl?.errors && !matchingControl.errors['passwordMismatch']) {
      return null;
    }
    if (control?.value !== matchingControl?.value) {
      matchingControl?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      matchingControl?.setErrors(null);
      return null;
    }
  };
}

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  registerForm: FormGroup;
  isLoading$: Observable<boolean> = this.store.select(selectAuthIsLoading);

  constructor() {
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator('password', 'confirmPassword') }
    );
  }

  // Form control getters
  get firstNameCtrl() {
    return this.registerForm.get('firstName') as FormControl;
  }
  get lastNameCtrl() {
    return this.registerForm.get('lastName') as FormControl;
  }
  get emailCtrl() {
    return this.registerForm.get('email') as FormControl;
  }
  get passwordCtrl() {
    return this.registerForm.get('password') as FormControl;
  }
  get confirmPasswordCtrl() {
    return this.registerForm.get('confirmPassword') as FormControl;
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    // const { confirmPassword, ...payload } = this.registerForm.value;
    const payload  = this.registerForm.value;
    this.store.dispatch(AuthActions.register({ payload }));
  }
}
