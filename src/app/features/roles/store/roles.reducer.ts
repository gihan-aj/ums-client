import { createFeature, createReducer, on } from "@ngrx/store";
import { initialRolesState } from "./roles.state";
import { RolesActions } from "./roles.actions";

export const rolesFeature = createFeature({
    name: 'roles',
    reducer: createReducer(
        initialRolesState,

        on(RolesActions.loadRoles, (state) => ({
            ...state,
            isLoading: true,
            error: null
        })),
        
        on(RolesActions.loadRolesSuccess, (state, { roles }) => ({
            ...state,
            roles,
            isLoading: false,
        })),
        
        on(RolesActions.loadRolesFailure, (state, { error }) => ({
            ...state,
            isLoading: false,
            error
        })),
    )
})

// Export renamed selectors for clarity
export const {
  name,
  reducer,
  selectRolesState,
  selectRoles,
  selectIsLoading: selectRolesIsLoading,
  selectError: selectRolesError,
} = rolesFeature;