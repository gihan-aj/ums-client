import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { RolesService } from "../services/roles.service";
import { ErrorHandlingService } from "../../../core/services/error-handling.service";
import { HttpErrorResponse } from "@angular/common/http";
import { exhaustMap, map, catchError, of } from "rxjs";
import { RolesActions } from "./roles.actions";

@Injectable()
export class RolesEffects {
  private actions$ = inject(Actions);
  private rolesService = inject(RolesService);
  private errorHandlingService = inject(ErrorHandlingService);

  loadRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.loadRoles),
      exhaustMap(() =>
        this.rolesService.getRoles().pipe(
          map((roles) => RolesActions.loadRolesSuccess({ roles })),
          catchError((error: HttpErrorResponse) => {
            const errorMessage =
              this.errorHandlingService.handleHttpError(error);
            return of(RolesActions.loadRolesFailure({ error: errorMessage }));
          })
        )
      )
    )
  );
}