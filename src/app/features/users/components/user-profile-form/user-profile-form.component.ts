import { Component, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserDetails } from '../../store/users.state';
import { UserDetailStateService } from '../../services/user-detail-state.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectUsersIsLoading } from '../../store/users.reducer';

@Component({
  selector: 'app-user-profile-form',
  imports: [CommonModule, ReactiveFormsModule, InputComponent],
  templateUrl: './user-profile-form.component.html',
  styleUrl: './user-profile-form.component.scss',
})
export class UserProfileFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true }) user!: UserDetails;
  @Input() isEditMode: boolean = false;

  private fb = inject(FormBuilder);
  private store = inject(Store);
  private userDetailState = inject(UserDetailStateService);

  profileForm: FormGroup;

  isLoading$: Observable<boolean> = this.store.select(selectUsersIsLoading);

  constructor() {
    this.profileForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      email: [
        { value: '', disabled: true },
        [Validators.required, Validators.email],
      ],
    });
  }

  ngOnInit(): void {
    this.profileForm.patchValue(this.user);
    // Register this form with the shared state service
    this.userDetailState.registerForm('profile', this.profileForm);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Enable or disable the form based on the edit mode
    if (changes['isEditMode']) {
      if (this.isEditMode) {
        this.profileForm.enable();
        this.profileForm.get('email')?.disable();
      } else {
        this.profileForm.disable();
      }
    }
  }

  ngOnDestroy(): void {
    // Clean up by unregistering the form when the component is destroyed
    this.userDetailState.unregisterForm('profile');
  }

  // Getters for easier template access
  get firstNameCtrl() {
    return this.profileForm.get('firstName') as FormControl;
  }
  get lastNameCtrl() {
    return this.profileForm.get('lastName') as FormControl;
  }
  get emailCtrl() {
    return this.profileForm.get('email') as FormControl;
  }
}
