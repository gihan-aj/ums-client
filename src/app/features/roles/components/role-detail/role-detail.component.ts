import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { PermissionTreeComponent } from '../../../../shared/components/permission-tree/permission-tree.component';
import { Store } from '@ngrx/store';
import { BreadcrumbService } from '../../../../core/services/breadcrumb.service';
import {
  combineLatest,
  filter,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';
import { PermissionGroup } from '../../../permissions/store/permissions.state';
import {
  selectAllPermissions,
  selectPermissionsAreLoading,
} from '../../../permissions/store/permissions.reducer';
import {
  name,
  selectRolesIsLoading,
  selectSelectedRole,
} from '../../store/roles.reducer';
import { PermissionsActions } from '../../../permissions/store/permissions.actions';
import { RolesActions } from '../../store/roles.actions';
import { Role } from '../../store/roles.state';

@Component({
  selector: 'app-role-detail',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    InputComponent,
    ButtonComponent,
    PermissionTreeComponent,
  ],
  templateUrl: './role-detail.component.html',
  styleUrl: './role-detail.component.scss',
})
export class RoleDetailComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private breadcrumbService = inject(BreadcrumbService);

  roleForm: FormGroup;
  isEditMode = false;
  isViewMode = false;
  headerTitle = 'Add New Role';
  isLoading$: Observable<boolean>;
  arePermissionsLoading$: Observable<boolean>;
  allPermissionGroups$: Observable<PermissionGroup[]> =
    this.store.select(selectAllPermissions);

  private roleId: number | null = null;

  private destroy$ = new Subject<void>();

  constructor() {
    this.isLoading$ = this.store.select(selectRolesIsLoading);
    this.arePermissionsLoading$ = this.store.select(
      selectPermissionsAreLoading
    );
    // this.isLoading$ = combineLatest([
    //   this.store.select(selectRolesIsLoading),
    //   this.store.select(selectPermissionsAreLoading),
    // ]).pipe(
    //   map(([rolesLoading, permsLoading]) => rolesLoading || permsLoading)
    // );

    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      permissionNames: [[]],
    });
  }

  ngOnInit(): void {
    this.store.dispatch(PermissionsActions.loadAllPermissions());

    this.route.url.pipe(takeUntil(this.destroy$)).subscribe((urlSegments) => {
      // Determine the mode from the URL path
      this.isEditMode = urlSegments.some((s) => s.path === 'edit');
      this.isViewMode = urlSegments.some((s) => s.path === 'view');

      if(this.isEditMode) this.headerTitle = 'Edit Role'
      if(this.isViewMode) this.headerTitle = 'View Role'
    });

    this.route.paramMap
      .pipe(
        takeUntil(this.destroy$),
        switchMap((params) => {
          const id = params.get('id');
          if (id) {
            this.roleId = +id;

            this.store.dispatch(
              RolesActions.loadRoleById({ roleId: this.roleId })
            );

            // return this.store.select(selectSelectedRole);
            return combineLatest([
              this.store.select(selectSelectedRole),
              this.store.select(selectAllPermissions),
            ]).pipe(
              filter(([role, permissions]) => !!role && permissions.length > 0),
              take(1)
            );
          }

          return of([null, []] as [Role | null, PermissionGroup[]]);
        })
      )
      .subscribe(([role, permissions]) => {
        if ((this.isEditMode || this.isViewMode) && role) {
          this.roleForm.patchValue({
            name: role.name,
            description: role.description,
            permissionNames: role.permissions.map((p) => p.name),
          });
        }

        if (this.isViewMode) {
          this.roleForm.disable();
        }

        this.updateBreadcrumbs(role);
      });

    if (!this.isEditMode) {
      this.updateBreadcrumbs(null);
    }
  }

  updateBreadcrumbs(role: Role | null | undefined): void {
    let modelLabel = 'Add New';
    if (this.isEditMode) modelLabel = 'Edit:';
    if (this.isViewMode) modelLabel = 'View:';

    const breadcrumbs = [
      { label: 'Dashboard', url: '/dasboard' },
      { label: 'Roles Management', url: '/roles' },
      {
        label: `${modelLabel} ${role?.name ?? 'Role'}`,
      },
    ];

    this.breadcrumbService.setBreadcrumbs(breadcrumbs);
  }

  get nameCtrl() {
    return this.roleForm.get('name') as FormControl;
  }

  get descriptionCtrl() {
    return this.roleForm.get('description') as FormControl;
  }

  saveRole(): void {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    const payload = this.roleForm.value;
    if (this.isEditMode && this.roleId) {
      this.store.dispatch(
        RolesActions.updateRole({ roleId: this.roleId, payload })
      );
    } else {
      this.store.dispatch(RolesActions.addRole({ payload }));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
