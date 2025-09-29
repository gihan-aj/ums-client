import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PermissionService } from '../services/permission.service';
import { ErrorHandlingService } from '../../../core/services/error-handling.service';
import { PermissionsActions } from './permissions.actions';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class PermissionEffects {
  private actions$ = inject(Actions);
  private permissionsService = inject(PermissionService);
  private errorHandlingService = inject(ErrorHandlingService);

  loadAllPermissions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PermissionsActions.loadAllPermissions),
      exhaustMap(() =>
        this.permissionsService
          .getAllPermissions()
          .pipe(
            map((permissionGroups) =>
              PermissionsActions.loadAllPermissionsSuccess({ permissionGroups })
            )
          )
      ),
      catchError((error: HttpErrorResponse) => {
        const errorMessage = this.errorHandlingService.handleHttpError(error);

        return of(
          PermissionsActions.loadAllPermissionsFailure({ error: errorMessage })
        );
      })
    )
  );
}
