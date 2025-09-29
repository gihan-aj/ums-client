import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { PermissionGroup } from "./permissions.state";

export const PermissionsActions = createActionGroup({
    source: 'Permissions API',
    events: {
        'Load All Permissions': emptyProps(),
        'Load All Permissions Success': props<{ permissionGroups: PermissionGroup[] }>(),
        'Load All Permissions Failure': props<{ error: string }>()
    }
})