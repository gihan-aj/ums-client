import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectAuthIsLoading } from '../../store/auth.reducer';
import { AuthActions } from '../../store/auth.actions';

@Component({
  selector: 'app-request-password-reset',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './request-password-reset.component.html',
  styleUrl: './request-password-reset.component.scss',
})
export class RequestPasswordResetComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  form: FormGroup;
  isLoading$: Observable<boolean> = this.store.select(selectAuthIsLoading);

  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get emailCtrl() {
    return this.form.get('email') as FormControl;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.store.dispatch(
      AuthActions.requestPasswordReset({ email: this.form.value.email })
    );
  }
}
