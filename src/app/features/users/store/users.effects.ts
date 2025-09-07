import { inject, Injectable } from '@angular/core';
import { act, Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { UserService } from '../services/user.service';
import { ErrorHandlingService } from '../../../core/services/error-handling.service';
import { UsersActions } from './users.actions';
import {
  catchError,
  exhaustMap,
  forkJoin,
  map,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { selectUserQuery } from './users.reducer';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../../core/services/notification.service';
import { Router } from '@angular/router';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private router = inject(Router);
  private userService = inject(UserService);
  private errorHandlingService = inject(ErrorHandlingService);
  private notificationService = inject(NotificationService);

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      // Get the latest query state from the store
      withLatestFrom(this.store.select(selectUserQuery)),
      // We now have [action, query]
      exhaustMap(([action, query]) =>
        this.userService.getUsers(query).pipe(
          map((response) =>
            UsersActions.loadUsersSuccess({
              users: response.items,
              totalCount: response.totalCount,
            })
          ),
          catchError((error: HttpErrorResponse) => {
            const errorMessage =
              this.errorHandlingService.handleHttpError(error);
            return of(UsersActions.loadUsersFailure({ error: errorMessage }));
          })
        )
      )
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
      exhaustMap((action) => {
        // Create the two API call observables
        const updateProfile$ = this.userService.updateUserProfile(
          action.userId,
          action.profile
        );
        const assignUserRoles$ = this.userService.assignUserRoles(
          action.userId,
          action.roleIds
        );

        // Use forkJoin to run them in parallel and wait for both to complete
        return forkJoin([updateProfile$, assignUserRoles$]).pipe(
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
