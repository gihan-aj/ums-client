import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { Store } from '@ngrx/store';
import {
  asyncScheduler,
  combineLatest,
  filter,
  map,
  Observable,
  observeOn,
  of,
  startWith,
  switchMap,
  take,
} from 'rxjs';
import { UserDetails } from '../../store/users.state';
import {
  selectSelectedUser,
  selectUsersError,
  selectUsersIsLoading,
} from '../../store/users.reducer';
import { UsersActions } from '../../store/users.actions';
import { NotFoundComponent } from '../../../../shared/components/not-found/not-found.component';
import { UserDetailStateService } from '../../services/user-detail-state.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Permission, Role } from '../../../roles/store/roles.state';
import { selectRoles } from '../../../roles/store/roles.reducer';
import { HasPermissionDirective } from '../../../../core/directives/has-permission.directive';
import { selectUserPermissions } from '../../../auth/store/auth.reducer';

@Component({
  selector: 'app-user-detail-page',
  imports: [
    CommonModule,
    RouterLink,
    ButtonComponent,
    UserDetailsComponent,
    NotFoundComponent,
  ],
  templateUrl: './user-detail-page.component.html',
  styleUrl: './user-detail-page.component.scss',
  providers: [UserDetailStateService],
})
export class UserDetailPageComponent implements OnInit {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userDetailState = inject(UserDetailStateService);
  private notificationService = inject(NotificationService);

  isLoading$: Observable<boolean> = this.store.select(selectUsersIsLoading);
  error$: Observable<string | null> = this.store.select(selectUsersError);
  user$: Observable<UserDetails | null> = this.store.select(selectSelectedUser);
  isEditMode$: Observable<boolean>;

  previewPermissions$!: Observable<Permission[]>;

  // --- Permission Observables
  canUpdateProfile$: Observable<boolean>;
  canAssignRoles$: Observable<boolean>;

  constructor() {
    this.isEditMode$ = this.route.url.pipe(
      map((urlSegments) =>
        urlSegments.some((segment) => segment.path === 'edit')
      )
    );

    const permissions$ = this.store.select(selectUserPermissions);
    this.canUpdateProfile$ = permissions$.pipe(
      map((p) => p.includes('users:update'))
    );
    this.canAssignRoles$ = permissions$.pipe(
      map((p) => p.includes('users:assign_role'))
    );
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          if (id) {
            this.store.dispatch(UsersActions.loadUserById({ userId: id }));
          }
          return of(null);
        })
      )
      .subscribe();

    // const userId = this.route.snapshot.paramMap.get('id');
    // if (userId) {
    //   this.store.dispatch(UsersActions.loadUserById({ userId }));
    // } else {
    //   // Handle case where ID is missing, maybe navigate back to list
    //   this.router.navigate(['/users']);
    // }

    this.setupPermissionPreview();
  }

  private setupPermissionPreview(): void {
    const allRoles$ = this.store.select(selectRoles);

    // Reactively wait for the 'roles, form to be ready
    this.previewPermissions$ = this.userDetailState.whenFormReady('roles').pipe(
      // Once the form is ready, switch to a new observable that combines roles and form changes
      switchMap((roleForm) =>
        combineLatest([
          allRoles$,
          roleForm.valueChanges.pipe(startWith(roleForm.value)),
        ])
      ),
      // Use asyncScheduler to avoid ExpressionChangedAfterItHasBeenCheckedError
      observeOn(asyncScheduler),
      map(([allRoles, roleFormValue]) => {
        return this.calculatePreviewPermissions(allRoles, roleFormValue);
      })
    );
  }

  private calculatePreviewPermissions(
    allRoles: Role[],
    roleFormValue: any
  ): Permission[] {
    const selectedRoleIds = Object.keys(roleFormValue).filter(
      (id) => roleFormValue[id]
    );

    const permissionsMap = new Map<string, Permission>();

    allRoles
      .filter((role) => selectedRoleIds.includes(role.id.toString()))
      .forEach((role) => {
        console.log(role);
        role.permissions.forEach((perm) => {
          if (!permissionsMap.has(perm.name)) {
            permissionsMap.set(perm.name, perm);
          }
        });
      });

    return Array.from(permissionsMap.values());
  }

  onSave(): void {
    this.userDetailState.markAllAsTouched();

    if (!this.userDetailState.isValid()) {
      this.notificationService.showError(
        'Please correct the validation errors.'
      );
      return;
    }

    this.user$
      .pipe(
        take(1),
        filter((user) => !!user)
      )
      .subscribe((user) => {
        const formData = this.userDetailState.getValue();
        this.store.dispatch(
          UsersActions.updateUser({ userId: user!.id, payload: formData })
        );
      });
  }
}
