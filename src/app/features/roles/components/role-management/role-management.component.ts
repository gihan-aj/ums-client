import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ColumnDef, SortChange, TableComponent } from '../../../../shared/components/table/table.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { HasPermissionDirective } from '../../../../core/directives/has-permission.directive';
import { Store } from '@ngrx/store';
import { BreadcrumbService } from '../../../../core/services/breadcrumb.service';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { Role, RolesQuery } from '../../store/roles.state';
import {
  selectRoles,
  selectRolesIsLoading,
  selectRolesQuery,
  selectRolesTotalCount,
} from '../../store/roles.reducer';
import { FormControl } from '@angular/forms';
import { RolesActions } from '../../store/roles.actions';
import { Router } from '@angular/router';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { DialogService } from '../../../../core/services/dialog.service';
import { selectUser } from '../../../auth/store/auth.reducer';
import { User } from '../../../auth/store/auth.state';

@Component({
  selector: 'app-role-management',
  imports: [
    CommonModule,
    TableComponent,
    ButtonComponent,
    InputComponent,
    PaginationComponent,
    HasPermissionDirective,
  ],
  templateUrl: './role-management.component.html',
  styleUrl: './role-management.component.scss',
})
export class RoleManagementComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  private breadcrumbService = inject(BreadcrumbService);
  private dialogService = inject(DialogService);

  @ViewChild('actionsCell', { static: true }) actionsCell!: TemplateRef<any>;

  roles$: Observable<Role[]> = this.store.select(selectRoles);
  isLoading$: Observable<boolean> = this.store.select(selectRolesIsLoading);
  totalCount$: Observable<number> = this.store.select(selectRolesTotalCount);
  query$: Observable<RolesQuery> = this.store.select(selectRolesQuery);

  currentUser$: Observable<User | null> = this.store.select(selectUser);

  searchControl = new FormControl('');

  columns: ColumnDef<Role>[] = [];

  destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.columns = [
      {
        key: 'name',
        header: 'Role Name',
        sortable: true,
      },
      {
        key: 'description',
        header: 'Description',
        sortable: true,
      },
      {
        key: 'actions',
        header: 'Actions',
        cellTemplate: this.actionsCell,
        align: 'center',
      },
    ];

    this.store.dispatch(RolesActions.loadRoles({}));

    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((searchTerm) => {
        this.store.dispatch(
          RolesActions.setRolesSearchTerm({ searchTerm: searchTerm ?? '' })
        );
      });

    this.breadcrumbService.setBreadcrumbs([
      { label: 'Dashboard', url: '/dashboard' },
      { label: 'Role Management' },
    ]);
  }

  onSortChange(sort: SortChange): void {
    this.store.dispatch(
      RolesActions.loadRoles({
        query: {
          page: 1,
          sortColumn: sort.column,
          sortOrder: sort.direction,
        },
      })
    );
  }

  onPageChange(newPage: number): void {
    this.store.dispatch(RolesActions.loadRoles({ query: { page: newPage } }));
  }

  addRole(): void {
    this.router.navigate(['/roles/add']);
  }

  viewRole(role: Role): void {
    this.router.navigate(['/roles/view', role.id]);
  }

  editRole(role: Role): void {
    this.router.navigate(['/roles/edit', role.id]);
  }

  deleteRole(role: Role): void {
    this.dialogService
      .openConfirmationDialog({
        title: 'Delete Role',
        message: `Are you sure you want to delete the role "${role.name}"? This action cannot be undone.`,
        confirmButtonText: 'Delete',
        confirmButtonColor: 'danger',
        type: 'danger',
      })
      .pipe(filter((confirmed) => confirmed === true))
      .subscribe(() =>
        this.store.dispatch(RolesActions.deleteRole({ roleId: role.id }))
      );
  }
}
