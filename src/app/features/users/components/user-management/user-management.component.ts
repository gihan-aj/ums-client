import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ColumnDef, SortChange, TableComponent } from '../../../../shared/components/table/table.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User, UserQuery } from '../../store/users.state';
import {
  selectTotalCount,
  selectUserQuery,
  selectUsers,
  selectUsersIsLoading,
} from '../../store/users.reducer';
import { UsersActions } from '../../store/users.actions';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { DialogService } from '../../../../core/services/dialog.service';

@Component({
  selector: 'app-user-management',
  imports: [CommonModule, TableComponent, ButtonComponent, PaginationComponent],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit {
  private store = inject(Store);
  private dialogService = inject(DialogService);

  // Get a reference to the ng-template for our custom actions column
  @ViewChild('actionsCell', { static: true }) actionsCell!: TemplateRef<any>;
  @ViewChild('statusCell', { static: true }) statusCell!: TemplateRef<any>;

  users$: Observable<User[]> = this.store.select(selectUsers);
  isLoading$: Observable<boolean> = this.store.select(selectUsersIsLoading);
  totalCount$: Observable<number> = this.store.select(selectTotalCount);
  query$: Observable<UserQuery> = this.store.select(selectUserQuery);

  columns: ColumnDef<User>[] = [];

  ngOnInit(): void {
    // Define the columns for our table, including the custom template
    this.columns = [
      { key: 'userCode', header: 'User Code', sortable: true },
      { key: 'email', header: 'Email', sortable: true },
      { key: 'firstName', header: 'First Name', sortable: true },
      { key: 'lastName', header: 'Last Name', sortable: true },
      {
        key: 'isActive',
        header: 'Status',
        sortable: true,
        cellTemplate: this.statusCell,
      },
      { key: 'actions', header: 'Actions', cellTemplate: this.actionsCell },
    ];

    // Dispatch the action to load the initial set of users
    this.store.dispatch(UsersActions.loadUsers({}));
  }

  onSortChange(sort: SortChange): void {
    // Dispatch an action to update the query and reload the users
    this.store.dispatch(
      UsersActions.loadUsers({
        query: {
          sortColumn: sort.column,
          sortDirection: sort.direction,
        },
      })
    );
  }

  onPageChange(newPage: number): void {
    this.store.dispatch(UsersActions.loadUsers({ query: { page: newPage } }));
  }

  addUser(): void {
    this.dialogService.openAddUserModal();
  }

  editUser(user: User): void {
    console.log('Edit user:', user.id);
    // We will implement the edit logic later
  }

  deleteUser(user: User): void {
    console.log('Delete user:', user.id);
    // We will implement the delete logic later
  }
}
