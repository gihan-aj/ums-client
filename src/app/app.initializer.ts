import { inject } from "@angular/core";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { AuthActions } from "./features/auth/store/auth.actions";
import { first, Observable, of } from 'rxjs';

/**
 * This is the initializer function that will be executed during app startup.
 * It will be called by Angular in an injection context, so inject() is safe here.
 * It attempts to refresh the user's session and waits for the process to complete.
 */
export function initializeAuth(): Observable<any> {
  const store = inject(Store);
  const actions$ = inject(Actions);

  const currentPath = window.location.pathname;

  // If the user is loading the app on an auth route (e.g., from an email link),
  // do not attempt to refresh the token. Let the app load and navigate normally.
  if (currentPath.startsWith('/auth')) {
    // Return an observable that completes immediately.
    return of(true);
  }

  // Otherwise, attempt a silent refresh.
  // Dispatch the action to start the token refresh process.
  store.dispatch(AuthActions.refreshToken());

  // Return an observable that completes when the refresh attempt is finished.
  // The APP_INITIALIZER will wait for this observable to complete.
  return actions$.pipe(
    ofType(AuthActions.refreshTokenSuccess, AuthActions.refreshTokenFailure),
    first() // The stream will complete after the first of these actions is dispatched.
  );
}