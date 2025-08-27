import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectUsersIsLoading } from '../../store/users.reducer';
import { UsersActions } from '../../store/users.actions';

@Component({
  selector: 'app-add-user-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './add-user-modal.component.html',
  styleUrl: './add-user-modal.component.scss',
})
export class AddUserModalComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  userForm: FormGroup;
  isLoading$: Observable<boolean> = this.store.select(selectUsersIsLoading);

  // This will be set by the DialogService to close the modal
  public close!: () => void;

  constructor() {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // Form control getters
  get firstNameCtrl() {
    return this.userForm.get('firstName') as FormControl;
  }
  get lastNameCtrl() {
    return this.userForm.get('lastName') as FormControl;
  }
  get emailCtrl() {
    return this.userForm.get('email') as FormControl;
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    console.log("Adding user: ", this.userForm.value)
    // this.store.dispatch(UsersActions.addUser({ payload: this.userForm.value }));
  }
}
