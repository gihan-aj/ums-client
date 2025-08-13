import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { selectAuthIsLoading } from '../../store/auth.reducer';
import { AuthActions } from '../../store/auth.actions';

// Re-using the password match validator
export function passwordMatchValidator(controlName: string, matchingControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): { [key: string]: any } | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);
    if (matchingControl?.errors && !matchingControl.errors['passwordMismatch']) { return null; }
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
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  isLoading$: Observable<boolean> = this.store.select(selectAuthIsLoading);
  form!: FormGroup;

  private token: string | null = null;
  private email: string | null = null;

  ngOnInit(): void {
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      this.token = params['token'];
      this.email = params['email'];

      if (!this.token || !this.email) {
        this.router.navigate(['/login']);
        return;
      }
      this.initializeForm();
    });
  }

  private initializeForm(): void {
    this.form = this.fb.group(
      {
        email: [{ value: this.email, disabled: true }],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator('newPassword', 'confirmPassword') }
    );
  }

  get emailCtrl() {
    return this.form.get('email') as FormControl;
  }
  get newPasswordCtrl() {
    return this.form.get('newPassword') as FormControl;
  }
  get confirmPasswordCtrl() {
    return this.form.get('confirmPassword') as FormControl;
  }

  submit(): void {
    if (this.form.invalid || !this.token || !this.email) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = {
      token: this.token,
      email: this.email,
      ...this.form.value,
    };
    this.store.dispatch(AuthActions.resetPassword({ payload }));
  }
}
