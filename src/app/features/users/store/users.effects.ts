import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { UserService } from '../services/user.service';
import { ErrorHandlingService } from '../../../core/services/error-handling.service';
import { UsersActions } from './users.actions';
import { catchError, exhaustMap, map, of, withLatestFrom } from 'rxjs';
import { selectUserQuery } from './users.reducer';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private userService = inject(UserService);
  private errorHandlingService = inject(ErrorHandlingService);

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
}
