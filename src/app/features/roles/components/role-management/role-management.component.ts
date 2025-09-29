import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ColumnDef, SortChange, TableComponent } from '../../../../shared/components/table/table.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { HasPermissionDirective } from '../../../../core/directives/has-permission.directive';
import { Store } from '@ngrx/store';
import { BreadcrumbService } from '../../../../core/services/breadcrumb.service';
import { Observable, Subject } from 'rxjs';
import { Role, RolesQuery } from '../../store/roles.state';
import { selectRoles, selectRolesIsLoading, selectRolesQuery, selectRolesTotalCount } from '../../store/roles.reducer';
import { FormControl } from '@angular/forms';
import { RolesActions } from '../../store/roles.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-management',
  imports: [
    CommonModule,
    TableComponent,
    ButtonComponent,
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

  @ViewChild('actionsCell', { static: true }) actionsCell!: TemplateRef<any>;

  roles$: Observable<Role[]> = this.store.select(selectRoles);
  isLoading$: Observable<boolean> = this.store.select(selectRolesIsLoading);
  totalCount$: Observable<number> = this.store.select(selectRolesTotalCount);
  query$: Observable<RolesQuery> = this.store.select(selectRolesQuery);

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

  editRole(role: Role): void {
    this.router.navigate(['/roles/edit', role.id]);
  }

  deleteRole(role: Role): void {
    // Logic for deleting a role will be implemented later
  }
}
