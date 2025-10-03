import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { Store } from '@ngrx/store';
import { selectProfileIsLoading } from '../../store/profile.reducer';
import { filter, first, Observable } from 'rxjs';
import { User } from '../../../auth/store/auth.state';
import { selectUser } from '../../../auth/store/auth.reducer';
import { ProfileActions } from '../../store/profile.actions';

@Component({
  selector: 'app-profile-details',
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './profile-details.component.html',
  styleUrl: './profile-details.component.scss'
})
export class ProfileDetailsComponent implements OnInit{
  private fb = inject(FormBuilder);
  private store = inject(Store);

  profileForm: FormGroup;
  isLoading$: Observable<boolean> = this.store.select(selectProfileIsLoading);
  currentUser$ : Observable<User | null> = this.store.select(selectUser);

  constructor() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
    })
  }

  ngOnInit(): void {
    this.currentUser$.pipe(
      filter((user) : user is User => !!user), // Ensure user is not null
      first() // Take the first not-null value to populate form
    )
    .subscribe((user) => {
      this.profileForm.patchValue({
        firstName: user.given_name,
        lastName: user.family_name,
      })
    })
  }

  get firstNameCtrl() {
    return this.profileForm.get('firstName') as FormControl;
  }

  get lastNameCtrl() {
    return this.profileForm.get('lastName') as FormControl;
  }

  saveProfile(): void {
    if(this.profileForm.invalid){
      this.profileForm.markAllAsTouched();
      return;
    }

    this.store.dispatch(ProfileActions.updateProfile({ payload: this.profileForm.value}));
  }
}
