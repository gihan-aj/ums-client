import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, catchError, filter, Observable, of, switchMap, take, throwError } from 'rxjs';
import { selectAccessToken } from '../../features/auth/store/auth.reducer';
import { AuthActions } from '../../features/auth/store/auth.actions';

// --- State managed within the interceptor's closure ---
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

/**
 * Attaches the JWT to outgoing requests and handles 401 errors by
 * attempting to refresh the token.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  // Don't intercept requests for auth endpoints
  if (req.url.includes('/auth/')) {
    return next(req);
  }

  // Get the token and then proceed with the request
  return store.select(selectAccessToken).pipe(
    take(1),
    switchMap(token => {
      let clonedReq = req;
      if (token) {
        clonedReq = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });
      }
      
      // Pass the request to the next handler and catch errors
      return next(clonedReq).pipe(
        catchError(error => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            return handle401Error(clonedReq, next, store);
          }
          return throwError(() => error);
        })
      );
    })
  );
};

/**
 * Handles the 401 error by dispatching a refresh token action and replaying the request.
 */
function handle401Error(request: HttpRequest<any>, next: HttpHandlerFn, store: Store): Observable<HttpEvent<any>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);
    store.dispatch(AuthActions.refreshToken());

    return store.select(selectAccessToken).pipe(
      filter(token => token != null),
      take(1),
      switchMap(token => {
        isRefreshing = false;
        refreshTokenSubject.next(token);
        return next(request.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        }));
      }),
      catchError((err) => {
        isRefreshing = false;
        store.dispatch(AuthActions.logout({}));
        return throwError(() => err);
      })
    );
  }

  // If a refresh is already in progress, wait for the new token
  return refreshTokenSubject.pipe(
    filter(token => token != null),
    take(1),
    switchMap(token => next(request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    })))
  );
}