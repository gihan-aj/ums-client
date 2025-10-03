import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { Store } from '@ngrx/store';
import { selectProfileIsLoading } from '../../store/profile.reducer';
import { ProfileActions } from '../../store/profile.actions';

function passwordMatchValidator(controlName: string, matchingControlName: string): ValidatorFn{
  return (formGroup: AbstractControl) : { [key: string]: any } | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    if(matchingControl?.errors && !matchingControl.errors['passwordMismatch']){
      return null; // Return if another validator has found an error on the matchingControl
    }

    if(control?.value !== matchingControl?.value){
      matchingControl?.setErrors({ passwordMismatch: true});
      return { passwordMismatch: true };
    } else {
      matchingControl?.setErrors(null);
      return null;
    }
  }
}

@Component({
  selector: 'app-change-password',
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  passwordForm: FormGroup;
  isLoading$ = this.store.select(selectProfileIsLoading);

  constructor() {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator('newPassword', 'confirmPassword') }
    );
  }

  get currentPasswordCtrl() {
    return this.passwordForm.get('currentPassword') as FormControl;
  }
  get newPasswordCtrl() {
    return this.passwordForm.get('newPassword') as FormControl;
  }
  get confirmPasswordCtrl() {
    return this.passwordForm.get('confirmPassword') as FormControl;
  }

  savePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.store.dispatch(
      ProfileActions.changePassword({ payload: this.passwordForm.value })
    );
  }
}
