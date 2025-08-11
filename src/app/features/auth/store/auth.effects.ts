import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { AuthActions } from "./auth.actions";
import { catchError, exhaustMap, map, of, tap } from "rxjs";

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

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
            // On failure, dispatch the LoginFailure action with the error message
            const errorMessage =
              error.error?.message || 'An unknown error occurred.';
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
          // Navigate to the main dashboard or home page after login
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false } // This effect does not dispatch any new actions
  );
}
