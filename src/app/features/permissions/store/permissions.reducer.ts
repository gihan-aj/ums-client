import { createFeature, createReducer, on } from "@ngrx/store";
import { initialPermissionsState } from "./permissions.state";
import { PermissionsActions } from "./permissions.actions";

export const permissionsFeature = createFeature({
    name: 'permissions',
    reducer: createReducer(
        initialPermissionsState,

        on(PermissionsActions.loadAllPermissions, (state) => ({
            ...state,
            isLoading: true,
            error: null
        })),

        on(PermissionsActions.loadAllPermissionsSuccess, (state, { permissionGroups }) => ({
            ...state,
            permissionGroups,
            isLoading: false,
        })),
        
        on(PermissionsActions.loadAllPermissionsFailure, (state, { error }) => ({
            ...state,
            isLoading: false,
            error
        })),
    )
});

export const {
    selectPermissionGroups: selectAllPermissions,
    selectIsLoading: selectPermissionsAreLoading
} = permissionsFeature