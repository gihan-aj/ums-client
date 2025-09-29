import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Role, RolesQuery } from './roles.state';

interface AddRolePayload {
  name: string;
  permissionNames: string[];
}

export const RolesActions = createActionGroup({
  source: 'Roles API',
  events: {
    // --- UI Events ---
    'Set Roles Search Term': props<{ searchTerm: string }>(),

    // --- Load All Roles Actions ---
    'Load All Roles': emptyProps(),
    'Load All Roles Success': props<{ roles: Role[] }>(),
    'Load All Roles Failure': props<{ error: string }>(),

    // --- Load Roles List Actions ---
    'Load Roles': props<{ query?: Partial<RolesQuery> }>(),
    'Load Roles Success': props<{ roles: Role[]; totalCount: number }>(),
    'Load Roles Failure': props<{ error: string }>(),

    // Action to update the current query (e.g., for pagination or sorting)
    'Update Roles Query': props<{ query: Partial<RolesQuery> }>(),

    // --- Add Role Actions ---
    'Add Role': props<{ payload: AddRolePayload }>(),
    'Add Role Success': props<{ roleId: number }>(),
    'Add Role Failure': props<{ error: string }>(),

    // --- Load Single Role Actions ---
    'Load Role By Id': props<{ roleId: number }>(),
    'Load Role By Id Success': props<{ role: Role }>(),
    'Load Role By Id Failure': props<{ error: string }>(),

    // --- Update Role Actions ---
    'Update Role': props<{
      roleId: number;
      payload: any;
    }>(),
    'Update Role Success': props<{ role: Role }>(),
    'Update Role Failure': props<{ error: string }>(),
    'Update Role No Changes': emptyProps(),

    // --- Delete Role Actions ---
    'Delete Role': props<{ roleId: number }>(),
    'Delete Role Success': props<{ roleId: number }>(),
    'Delete Role Failure': props<{ error: string }>(),
  },
});