import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ProfileService } from '../services/profile.service';
import { ErrorHandlingService } from '../../../core/services/error-handling.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ProfileActions } from './profile.actions';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthActions } from '../../auth/store/auth.actions';

@Injectable()
export class ProfileEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private profileService = inject(ProfileService);
  private errorHandlingService = inject(ErrorHandlingService);
  private notificationService = inject(NotificationService);

  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.updateProfile),
      exhaustMap((action) =>
        this.profileService.updateProfile(action.payload).pipe(
          map(() => ProfileActions.updateProfileSuccess()),
          catchError((error: HttpErrorResponse) => {
            const errorMessage =
              this.errorHandlingService.handleHttpError(error);
            return of(
              ProfileActions.updateProfileFailure({
                error: errorMessage,
              })
            );
          })
        )
      )
    )
  );

  updateProfileSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProfileActions.updateProfileSuccess),
        tap(() => {
          this.notificationService.showSuccess(
            'Your profile has been updated successfully.'
          );
          // Dispatch refreshToken to get a new JWT with the updated user claims (name)
          this.store.dispatch(AuthActions.refreshToken());
        })
      ),
    { dispatch: false }
  );

  changePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.changePassword),
      exhaustMap((action) =>
        this.profileService.changePassword(action.payload).pipe(
          map(() => ProfileActions.changePasswordSuccess()),
          catchError((error: HttpErrorResponse) => {
            const errorMessage =
              this.errorHandlingService.handleHttpError(error);
            return of(
              ProfileActions.changePasswordFailure({
                error: errorMessage,
              })
            );
          })
        )
      )
    )
  );

  changePasswordSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProfileActions.changePasswordSuccess),
        tap(() => {
          this.notificationService.showSuccess(
            'Your password has been changed successfully.'
          );
          // Forcing a logout after password change is a good security practice.
          this.store.dispatch(AuthActions.logout());
        })
      ),
    { dispatch: false }
  );
}
