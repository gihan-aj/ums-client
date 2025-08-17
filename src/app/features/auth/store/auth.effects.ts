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
          this.router.navigate(['/dashboard']);
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
            AuthActions.registerSuccess({ successMessage: response })
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
          this.router.navigate(['/auth/awaiting-activation']);
        })
      ),
    { dispatch: false }
  );

  // --- Activation Effects ---
  activateAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.activateAccount),
      exhaustMap((action) =>
        this.authService.activateAccount(action.token, action.email).pipe(
          map((response) =>
            AuthActions.activationSuccess({ successMessage: response })
          ),
          catchError((error: HttpErrorResponse) => {
            const errorMessage =
              this.errorHandlingService.handleHttpError(error);
            return of(AuthActions.activationFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  setInitialPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.setInitialPassword),
      exhaustMap((action) =>
        this.authService.setInitialPassword(action.payload).pipe(
          map((response) =>
            AuthActions.activationSuccess({ successMessage: response })
          ),
          catchError((error: HttpErrorResponse) => {
            const errorMessage =
              this.errorHandlingService.handleHttpError(error);
            return of(AuthActions.activationFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  activationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.activationSuccess),
        tap((action) => {
          this.notificationService.showSuccess(action.successMessage);
          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
  );

  activationFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.activationFailure),
        tap(() => {
          this.notificationService.showError('Activation failed.');
          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
  );

  // --- New Resend Activation Effects ---
  resendActivation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.resendActivation),
      exhaustMap((action) =>
        this.authService.resendActivation(action.email).pipe(
          map((response) =>
            AuthActions.resendActivationSuccess({
              successMessage: response,
            })
          ),
          catchError((error: HttpErrorResponse) => {
            const errorMessage =
              this.errorHandlingService.handleHttpError(error);
            return of(
              AuthActions.resendActivationFailure({ error: errorMessage })
            );
          })
        )
      )
    )
  );

  resendActivationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.resendActivationSuccess),
        tap((action) => {
          // Show the generic success message from the API. Using 'info' type is neutral.
          this.notificationService.showInfo(action.successMessage);
          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
  );

  // --- Request Password Reset Effects ---
  requestPasswordReset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.requestPasswordReset),
      exhaustMap((action) =>
        this.authService.requestPasswordReset(action.email).pipe(
          map((response) =>
            AuthActions.requestPasswordResetSuccess({
              successMessage: response,
            })
          ),
          catchError((error: HttpErrorResponse) => {
            const errorMessage =
              this.errorHandlingService.handleHttpError(error);
            return of(
              AuthActions.requestPasswordResetFailure({ error: errorMessage })
            );
          })
        )
      )
    )
  );

  requestPasswordResetSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.requestPasswordResetSuccess),
        tap((action) => {
          this.notificationService.showInfo(action.successMessage);
        })
      ),
    { dispatch: false }
  );

  resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.resetPassword),
      exhaustMap((action) =>
        this.authService.resetPassword(action.payload).pipe(
          map((response) =>
            AuthActions.resetPasswordSuccess({
              successMessage: response,
            })
          ),
          catchError((error: HttpErrorResponse) => {
            const errorMessage =
              this.errorHandlingService.handleHttpError(error);
            return of(
              AuthActions.resetPasswordFailure({ error: errorMessage })
            );
          })
        )
      )
    )
  );

  passwordResetSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.resetPasswordSuccess),
        tap((action) => {
          this.notificationService.showSuccess(action.successMessage);
          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
  );

  // Effect to handle logout navigation
  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap((action) => {
          if (action.navigateToLogin !== false) {
            this.router.navigate(['/auth/login']);
          }
        })
      ),
    { dispatch: false }
  );

  // --- New Refresh Token Effect ---
  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      exhaustMap(() =>
        this.authService.refreshToken().pipe(
          map((response) =>
            AuthActions.refreshTokenSuccess({
              user: {} as any, // Will be populated by reducer
              accessToken: response.token,
              tokenExpiryUtc: response.tokenExpiryUtc,
            })
          ),
          catchError(() => {
            // If refresh fails, the refresh token is invalid. Log the user out.
            return of(AuthActions.refreshTokenFailure());
          })
        )
      )
    )
  );

  refreshTokenFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshTokenFailure),
      map(() => AuthActions.logout({})) // Dispatch the logout action
    )
  );
}
