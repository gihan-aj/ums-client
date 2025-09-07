import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserDetails } from '../../store/users.state';
import { Role } from '../../../roles/store/roles.state';
import { Store } from '@ngrx/store';
import { UserDetailStateService } from '../../services/user-detail-state.service';
import { filter, first, Observable, Subscription } from 'rxjs';
import { selectRoles, selectRolesIsLoading } from '../../../roles/store/roles.reducer';
import { RolesActions } from '../../../roles/store/roles.actions';
import { CheckboxComponent } from '../../../../shared/components/checkbox/checkbox.component';

@Component({
  selector: 'app-user-roles-form',
  imports: [CommonModule, ReactiveFormsModule, CheckboxComponent],
  templateUrl: './user-roles-form.component.html',
  styleUrl: './user-roles-form.component.scss',
})
export class UserRolesFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true }) user!: UserDetails;
  @Input() isEditMode: boolean = false;

  private fb = inject(FormBuilder);
  private store = inject(Store);
  private userDetailState = inject(UserDetailStateService);
  private rolesSubscription: Subscription | undefined;

  rolesForm: FormGroup = this.fb.group({});
  allRoles$: Observable<Role[]> = this.store.select(selectRoles);
  isLoading$: Observable<boolean> = this.store.select(selectRolesIsLoading);

  ngOnInit(): void {
    this.store.dispatch(RolesActions.loadRoles());

    this.rolesSubscription = this.allRoles$
      .pipe(
        filter((roles) => roles.length > 0),
        first()
      )
      .subscribe((allRoles) => {
        this.buildForm(allRoles);
        this.userDetailState.registerForm('roles', this.rolesForm);
        this.updateFormDisabledState();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isEditMode'] && this.rolesForm.controls) {
      this.updateFormDisabledState();
    }
  }

  private buildForm(allRoles: Role[]): void {
    allRoles.forEach((role) => {
      const isAssigned = this.user.roles.some(
        (userRole) => userRole.id === role.id
      );
      this.rolesForm.addControl(
        role.id.toString(),
        this.fb.control(isAssigned)
      );
    });
  }

  private updateFormDisabledState(): void {
    if (this.isEditMode) {
      this.rolesForm.enable();
    } else {
      this.rolesForm.disable();
    }
  }

  ngOnDestroy(): void {
    this.userDetailState.unregisterForm('roles');
    this.rolesSubscription?.unsubscribe();
  }
}
