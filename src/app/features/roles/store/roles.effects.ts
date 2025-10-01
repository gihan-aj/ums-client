import { inject, Injectable } from '@angular/core';
import { act, Actions, createEffect, ofType } from '@ngrx/effects';
import { RolesService } from '../services/roles.service';
import { ErrorHandlingService } from '../../../core/services/error-handling.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  exhaustMap,
  map,
  catchError,
  of,
  debounceTime,
  withLatestFrom,
  tap,
  switchMap,
} from 'rxjs';
import { RolesActions } from './roles.actions';
import { Store } from '@ngrx/store';
import { selectRolesQuery, selectSelectedRole } from './roles.reducer';
import { NotificationService } from '../../../core/services/notification.service';
import { selectUserPermissions } from '../../auth/store/auth.reducer';
import { Router } from '@angular/router';

// A simple helper for deep object comparison
function isDeepEqual(obj1: any, obj2: any): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

@Injectable()
export class RolesEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private rolesService = inject(RolesService);
  private errorHandlingService = inject(ErrorHandlingService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

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

  loadRoleById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.loadRoleById),
      exhaustMap((action) =>
        this.rolesService.getRoleById(action.roleId).pipe(
          map((role) => RolesActions.loadRoleByIdSuccess({ role })),
          catchError((error: HttpErrorResponse) => {
            const errorMessage =
              this.errorHandlingService.handleHttpError(error);

            return of(
              RolesActions.loadRoleByIdFailure({ error: errorMessage })
            );
          })
        )
      )
    )
  );

  addRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.addRole),
      exhaustMap((action) =>
        this.rolesService.addRole(action.payload).pipe(
          map((response) =>
            RolesActions.addRoleSuccess({ roleId: response.id })
          ),
          catchError((error: HttpErrorResponse) => {
            const errorMessage =
              this.errorHandlingService.handleHttpError(error);

            return of(RolesActions.addRoleFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  addRoleSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RolesActions.addRoleSuccess),
        tap((action) => {
          this.notificationService.showSuccess('Role created successfully.');
          this.store.dispatch(RolesActions.loadRoles({}));
        })
      ),
    { dispatch: false }
  );

  updateRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.updateRole),
      withLatestFrom(this.store.select(selectSelectedRole)),
      exhaustMap(([action, originalRole]) => {
        if (!originalRole) {
          const errorMessage = 'Original role data not found in state.';
          this.notificationService.showError(errorMessage);
          return of(
            RolesActions.updateRoleFailure({
              error: errorMessage,
            })
          );
        }

        const originalPayload = {
          name: originalRole.name,
          description: originalRole.description,
          permissionNames: originalRole.permissions.map((p) => p.name).sort(),
        };

        const newPayload = {
          ...action.payload,
          permissionNames: [...action.payload.permissionNames].sort(),
        };

        if (isDeepEqual(newPayload, originalPayload)) {
          this.notificationService.showInfo('No changes to save.');
          return of(RolesActions.updateRoleNoChanges());
        }

        return this.rolesService.updateRole(action.roleId, action.payload).pipe(
          switchMap(() => this.rolesService.getRoleById(action.roleId)),
          map((updatedRole) =>
            RolesActions.updateRoleSuccess({ role: updatedRole })
          ),
          catchError((error: HttpErrorResponse) => {
            const errorMessage =
              this.errorHandlingService.handleHttpError(error);
            return of(RolesActions.updateRoleFailure({ error: errorMessage }));
          })
        );
      })
    )
  );

  updateRoleSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RolesActions.updateRoleSuccess),
        tap(() => {
          this.notificationService.showSuccess('Role updated successfully.');
          this.router.navigate(['/roles']);
        })
      ),
    { dispatch: false }
  );
}
