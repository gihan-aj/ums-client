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
import { Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { PermissionGroup } from '../../../permissions/store/permissions.state';
import { selectAllPermissions } from '../../../permissions/store/permissions.reducer';
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
  isLoading$: Observable<boolean>;
  allPermissionGroups$: Observable<PermissionGroup[]> =
    this.store.select(selectAllPermissions);

  private destroy$ = new Subject<void>();
  private roleId: number | null = null;

  constructor() {
    this.isLoading$ = this.store.select(selectRolesIsLoading);
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      permissions: [[]],
    });
  }

  ngOnInit(): void {
    this.store.dispatch(PermissionsActions.loadAllPermissions());

    this.route.paramMap
      .pipe(
        takeUntil(this.destroy$),
        switchMap((params) => {
          const id = params.get('id');
          if (id) {
            this.isEditMode = true;
            this.roleId = +id;
            this.store.dispatch(
              RolesActions.loadRoleById({ roleId: this.roleId })
            );
            return this.store.select(selectSelectedRole);
          }

          return of(null);
        })
      )
      .subscribe((role) => {
        if (role) {
          this.roleForm.patchValue({
            name: role.name,
            description: role.description,
            permissions: role.permissions.map((p) => p.name),
          });
        }

        this.updateBreadcrumbs(role);
      });

    if (!this.isEditMode) {
      this.updateBreadcrumbs(null);
    }
  }

  updateBreadcrumbs(role: Role | null | undefined): void {
    const breadcrumbs = [
      { label: 'Dashboard', url: '/dasboard' },
      { label: 'Roles Management', url: '/roles' },
      {
        label: this.isEditMode
          ? `Edit: ${role?.name ?? 'Role'}`
          : 'Add New Role',
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
