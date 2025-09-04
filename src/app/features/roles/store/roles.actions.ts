import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Role } from "./roles.state";

export const RolesActions = createActionGroup({
    source: 'Roles API',
    events: {
        'Load Roles': emptyProps(),
        'Load Roles Success': props<{ roles: Role[]}>(),
        'Load Roles Failure': props<{ error: string}>()
    }
})