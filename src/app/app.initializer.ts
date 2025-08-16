import { inject } from "@angular/core";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { AuthActions } from "./features/auth/store/auth.actions";
import { first, Observable } from "rxjs";

/**
 * This factory returns a function that will be executed during app initialization.
 * It attempts to refresh the user's session by dispatching the refreshToken action
 * and waits for the process to complete before the app starts.
 */
export function appInitializerFactory() {
  // inject() can be used here because this factory is called in an injection context.
  const store = inject(Store);
  const actions$ = inject(Actions);

  return () => {
    // Dispatch the action to start the token refresh process.
    store.dispatch(AuthActions.refreshToken());

    // Return an observable that completes when the refresh attempt is finished.
    // The APP_INITIALIZER will wait for this observable to complete.
    return actions$.pipe(
      ofType(AuthActions.refreshTokenSuccess, AuthActions.refreshTokenFailure),
      first() // The stream will complete after the first of these actions is dispatched.
    );
  };
}

/**
 * This is the initializer function that will be executed during app startup.
 * It will be called by Angular in an injection context, so inject() is safe here.
 * It attempts to refresh the user's session and waits for the process to complete.
 */
export function initializeAuth(): Observable<any> {
  const store = inject(Store);
  const actions$ = inject(Actions);

  // Dispatch the action to start the token refresh process.
  store.dispatch(AuthActions.refreshToken());

  // Return an observable that completes when the refresh attempt is finished.
  // The APP_INITIALIZER will wait for this observable to complete.
  return actions$.pipe(
    ofType(AuthActions.refreshTokenSuccess, AuthActions.refreshTokenFailure),
    first() // The stream will complete after the first of these actions is dispatched.
  );
}