import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import {
  ColumnDef,
  SortChange,
  TableComponent,
} from '../../../../shared/components/table/table.component';
import { Store } from '@ngrx/store';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { User, UserQuery } from '../../store/users.state';
import {
  selectUserQuery,
  selectUsers,
  selectUsersIsLoading,
  selectUsersTotalCount,
} from '../../store/users.reducer';
import { UsersActions } from '../../store/users.actions';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { DialogService } from '../../../../core/services/dialog.service';
import { Router } from '@angular/router';
import { HasPermissionDirective } from '../../../../core/directives/has-permission.directive';
import { FormControl } from '@angular/forms';
import { InputComponent } from '../../../../shared/components/input/input.component';

@Component({
  selector: 'app-user-management',
  imports: [
    CommonModule,
    TableComponent,
    ButtonComponent,
    PaginationComponent,
    HasPermissionDirective,
    InputComponent,
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private dialogService = inject(DialogService);
  private router = inject(Router);

  // Get a reference to the ng-template for our custom actions column
  @ViewChild('actionsCell', { static: true }) actionsCell!: TemplateRef<any>;
  @ViewChild('statusCell', { static: true }) statusCell!: TemplateRef<any>;

  users$: Observable<User[]> = this.store.select(selectUsers);
  isLoading$: Observable<boolean> = this.store.select(selectUsersIsLoading);
  totalCount$: Observable<number> = this.store.select(selectUsersTotalCount);
  query$: Observable<UserQuery> = this.store.select(selectUserQuery);

  searchControl = new FormControl('');

  columns: ColumnDef<User>[] = [];

  destroy$ = new Subject<void>();

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

    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((searchTerm) => {
        this.store.dispatch(
          UsersActions.setUsersSearchTerm({ searchTerm: searchTerm ?? '' })
        );
      });
  }

  onSortChange(sort: SortChange): void {
    // Dispatch an action to update the query and reload the users
    this.store.dispatch(
      UsersActions.loadUsers({
        query: {
          page: 1,
          sortColumn: sort.column,
          sortOrder: sort.direction,
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

  /**
   * Dispatches an action to activate or deactivate a user based on their current status.
   */
  toggleUserStatus(user: User): void {
    const action = user.isActive ? 'Deactivate' : 'Activate';
    const dialogRef = this.dialogService.openConfirmationDialog({
      title: `${action} User`,
      message: `Are you sure you want to ${action.toLowerCase()} the user "${
        user.email
      }"?`,
    });

    dialogRef
      .pipe(
        filter((confirmed) => confirmed === true) // Only proceed if the user confirms
      )
      .subscribe(() => {
        if (user.isActive) {
          this.store.dispatch(UsersActions.deactivateUser({ userId: user.id }));
        } else {
          this.store.dispatch(UsersActions.activateUser({ userId: user.id }));
        }
      });
  }

  /**
   * Navigates to the edit page for the selected user.
   */
  editUser(user: User): void {
    this.router.navigate(['/users/edit', user.id]);
  }

  deleteUser(user: User): void {
    console.log('Delete user:', user.id);
    // We will implement the delete logic later
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
