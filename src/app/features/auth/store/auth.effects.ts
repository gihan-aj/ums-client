import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { AuthActions } from "./auth.actions";
import { catchError, exhaustMap, map, of, tap } from "rxjs";
import { ErrorHandlingService } from '../../../core/services/error-handling.service';
import { NotificationService } from '../../../core/services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);
  private errorHandlingService = inject(ErrorHandlingService);
  private notificationService = inject(NotificationService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      // exhaustMap is used to prevent new login requests while one is already in progress
      exhaustMap((action) =>
        this.authService.login(action.payload).pipe(
          map((response) => {
            // On success, dispatch the LoginSuccess action with the response data
            return AuthActions.loginSuccess({
              user: {
                /* This will be populated by the reducer from the token */
              } as any,
              accessToken: response.token,
              tokenExpiryUtc: response.tokenExpiryUtc,
            });
          }),
          catchError((error) => {
            // Delegate all error handling to the service
            const errorMessage =
              this.errorHandlingService.handleHttpError(error);
            // Dispatch the failure action with the simple message
            return of(AuthActions.loginFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  // An effect to handle navigation after a successful login
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => {
          this.notificationService.showSuccess('Login successful!');
          // Navigate to the main dashboard or home page after login
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false } // This effect does not dispatch any new actions
  );

  // --- Register Effect ---
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap((action) =>
        this.authService.register(action.payload).pipe(
          map((response) =>
            AuthActions.registerSuccess({ successMessage: response.message })
          ),
          catchError((error: HttpErrorResponse) => {
            const errorMessage =
              this.errorHandlingService.handleHttpError(error);
            return of(AuthActions.registerFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  // Effect to handle side-effects of successful registration
  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap((action) => {
          // Show a success toast
          this.notificationService.showSuccess(action.successMessage);
          // Redirect to the awaiting activation page
          this.router.navigate(['/awaiting-activation']);
        })
      ),
    { dispatch: false }
  );
}
