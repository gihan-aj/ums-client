import { inject, Injectable } from '@angular/core';
import { act, Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { UserService } from '../services/user.service';
import { ErrorHandlingService } from '../../../core/services/error-handling.service';
import { UsersActions } from './users.actions';
import {
  catchError,
  debounceTime,
  exhaustMap,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { selectSelectedUser, selectUserQuery } from './users.reducer';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../../core/services/notification.service';
import { Router } from '@angular/router';
import { selectUserPermissions } from '../../auth/store/auth.reducer';

// A simple helper for deep object comparison
function isDeepEqual(obj1: any, obj2: any): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private router = inject(Router);
  private userService = inject(UserService);
  private errorHandlingService = inject(ErrorHandlingService);
  private notificationService = inject(NotificationService);

  searchUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.setUsersSearchTerm),
      // Wait for 300ms of silence before dispatching the load action
      debounceTime(300),
      map(() => UsersActions.loadUsers({}))
    )
  );

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      // Get the latest query state from the store
      withLatestFrom(this.store.select(selectUserQuery)),
      // We now have [action, query]
      exhaustMap(([action, query]) => {
        // We now combine the query from the state with any overrides from the action
        const finalQuery = { ...query, ...action.query };
        return this.userService.getUsers(finalQuery).pipe(
          map((pagedResult) =>
            UsersActions.loadUsersSuccess({
              users: pagedResult.items,
              totalCount: pagedResult.totalCount,
            })
          ),
          catchError((error: HttpErrorResponse) => {
            const errorMessage =
              this.errorHandlingService.handleHttpError(error);
            return of(UsersActions.loadUsersFailure({ error: errorMessage }));
          })
        );
      })
    )
  );

  // --- New Add User Effects ---
  addUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.addUser),
      exhaustMap((action) =>
        this.userService.addUser(action.payload).pipe(
          map((response) =>
            UsersActions.addUserSuccess({ userId: response.id })
          ),
          catchError((error: HttpErrorResponse) => {
            const errorMessage =
              this.errorHandlingService.handleHttpError(error);
            return of(UsersActions.addUserFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  addUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.addUserSuccess),
        tap((action) => {
          this.notificationService.showSuccess('User created successfully.');
          // After adding a user, dispatch an action to reload the table data
          this.store.dispatch(UsersActions.loadUsers({}));
        })
      ),
    { dispatch: false }
  );

  addUserFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.addUserFailure),
        tap((action) => {
          // this.notificationService.showError(action.error);
        })
      ),
    { dispatch: false }
  );

  // --- User Status Effects ---
  activateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.activateUser),
      exhaustMap((action) =>
        this.userService.activateUser(action.userId).pipe(
          map(() =>
            UsersActions.activateUserStatusSuccess({ userId: action.userId })
          ),
          catchError((error: HttpErrorResponse) => {
            const errorMessage =
              this.errorHandlingService.handleHttpError(error);
            return of(
              UsersActions.activateUserStatusFailure({ error: errorMessage })
            );
          })
        )
      )
    )
  );

  activateUserStatusSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.activateUserStatusSuccess),
        tap(() => {
          this.notificationService.showSuccess(
            `User has been successfully activated.`
          );
        })
      ),
    { dispatch: false }
  );

  deactivateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.deactivateUser),
      exhaustMap((action) =>
        this.userService.deactivateUser(action.userId).pipe(
          map(() =>
            UsersActions.deactivateUserStatusSuccess({ userId: action.userId })
          ),
          catchError((error: HttpErrorResponse) => {
            const errorMessage =
              this.errorHandlingService.handleHttpError(error);
            return of(
              UsersActions.deactivateUserStatusFailure({ error: errorMessage })
            );
          })
        )
      )
    )
  );

  deactivateUserStatusSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.deactivateUserStatusSuccess),
        tap(() => {
          this.notificationService.showSuccess(
            `User has been successfully deactivated.`
          );
        })
      ),
    { dispatch: false }
  );

  // --- Fetching a single user ---
  loadUserById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUserById),
      exhaustMap((action) =>
        this.userService.getUserById(action.userId).pipe(
          map((user) => UsersActions.loadUserByIdSuccess({ user })),
          catchError((error: HttpErrorResponse) => {
            const errorMessage =
              this.errorHandlingService.handleHttpError(error);
            // Optionally navigate back to user list on failure
            return of(
              UsersActions.loadUserByIdFailure({ error: errorMessage })
            );
          })
        )
      )
    )
  );

  // --- Update User Effects ---
  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUser),
      withLatestFrom(
        this.store.select(selectSelectedUser),
        this.store.select(selectUserPermissions)
      ),
      exhaustMap(([action, originalUser, permissions]) => {
        if (!originalUser) {
          return of(
            UsersActions.updateUserFailure({
              error: 'Original user data not found in state.',
            })
          );
        }
        const apiCalls: Observable<any>[] = [];

        if (permissions.includes('users:update')) {
          const newProfile = {
            firstName: action.payload.firstName,
            lastName: action.payload.lastName,
          };
          const originalProfile = {
            firstName: originalUser.firstName,
            lastName: originalUser.lastName,
          };
          const isProfileChanged = !isDeepEqual(originalProfile, newProfile);

          if (isProfileChanged) {
            apiCalls.push(
              this.userService.updateUserProfile(action.userId, newProfile)
            );
          }
        }

        if (permissions.includes('users:assign_role')) {
          const newRoleIds = Object.keys(action.payload.roles)
            .filter((id) => action.payload.roles[id])
            .map((id) => parseInt(id, 10));

          const originalRoleIds = originalUser.roles.map((r) => r.id);

          const areRolesChanged = !isDeepEqual(
            originalRoleIds.sort(),
            newRoleIds.sort()
          );

          if (areRolesChanged) {
            apiCalls.push(
              this.userService.assignUserRoles(action.userId, newRoleIds)
            );
          }
        }

        if (apiCalls.length === 0) {
          this.notificationService.showInfo('No changes to save.');
          // Dispatch a no-op action to prevent the UI from staying in a loading state
          return of(UsersActions.updateUserNoChanges());
        }

        // Use forkJoin to run them in parallel and wait for both to complete
        return forkJoin(apiCalls).pipe(
          // After both are successful, reload the user data to get the fresh permissions
          switchMap(() => this.userService.getUserById(action.userId)),
          map((updatedUser) =>
            UsersActions.updateUserSuccess({ user: updatedUser })
          ),
          catchError((error: HttpErrorResponse) => {
            const errorMessage =
              this.errorHandlingService.handleHttpError(error);
            return of(UsersActions.updateUserFailure({ error: errorMessage }));
          })
        );
      })
    )
  );

  updateUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.updateUserSuccess),
        tap(() => {
          this.notificationService.showSuccess('User updated successfully.');
          this.router.navigate(['/users']);
        })
      ),
    { dispatch: false }
  );
}
