import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { RolesService } from "../services/roles.service";
import { ErrorHandlingService } from "../../../core/services/error-handling.service";
import { HttpErrorResponse } from "@angular/common/http";
import {
  exhaustMap,
  map,
  catchError,
  of,
  debounceTime,
  withLatestFrom,
} from 'rxjs';
import { RolesActions } from './roles.actions';
import { Store } from '@ngrx/store';
import { selectRolesQuery } from './roles.reducer';

@Injectable()
export class RolesEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private rolesService = inject(RolesService);
  private errorHandlingService = inject(ErrorHandlingService);

  loadAllRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.loadAllRoles),
      exhaustMap(() =>
        this.rolesService.getAllRoles().pipe(
          map((roles) => RolesActions.loadAllRolesSuccess({ roles })),
          catchError((error: HttpErrorResponse) => {
            const errorMessage =
              this.errorHandlingService.handleHttpError(error);
            return of(
              RolesActions.loadAllRolesFailure({ error: errorMessage })
            );
          })
        )
      )
    )
  );

  searchRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.setRolesSearchTerm),
      debounceTime(500),
      map(() => RolesActions.loadRoles({}))
    )
  );

  loadRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.loadRoles),
      withLatestFrom(this.store.select(selectRolesQuery)),
      exhaustMap(([action, query]) => {
        const finalQuery = { ...query, ...action.query };
        return this.rolesService.getRoles(finalQuery).pipe(
          map((pagedResult) =>
            RolesActions.loadRolesSuccess({
              roles: pagedResult.items,
              totalCount: pagedResult.totalCount,
            })
          ),
          catchError((error: HttpErrorResponse) => {
            const errorMessage =
              this.errorHandlingService.handleHttpError(error);
            return of(RolesActions.loadRolesFailure({ error: errorMessage }));
          })
        );
      })
    )
  );
}