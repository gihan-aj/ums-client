import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { initialRolesState } from './roles.state';
import { RolesActions } from './roles.actions';

export const rolesFeature = createFeature({
  name: 'roles',
  reducer: createReducer(
    initialRolesState,

    on(RolesActions.loadAllRoles, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),

    on(RolesActions.loadAllRolesSuccess, (state, { roles }) => ({
      ...state,
      allRoles: roles,
      isLoading: false,
    })),

    on(RolesActions.loadAllRolesFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    on(RolesActions.setRolesSearchTerm, (state, { searchTerm }) => ({
      ...state,
      query: {
        ...state.query,
        page: 1,
        filters: searchTerm
          ? [
              {
                columnName: 'name',
                operator: 'contains',
                value: searchTerm,
              },
            ]
          : [],
      },
    })),

    on(RolesActions.loadRoles, (state, { query }) => ({
      ...state,
      isLoading: true,
      error: null,
      query: { ...state.query, ...query },
    })),

    on(RolesActions.loadRolesSuccess, (state, { roles, totalCount }) => ({
      ...state,
      roles,
      totalCount,
      isLoading: false,
    })),

    on(RolesActions.loadRolesFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    on(RolesActions.updateRolesQuery, (state, { query }) => ({
      ...state,
      query: { ...state.query, ...query },
    })),

    // --- Add Role Reducers ---
    on(RolesActions.addRole, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),

    on(RolesActions.addRoleSuccess, (state) => ({
      ...state,
      isLoading: false,
      error: null,
    })),

    on(RolesActions.addRoleFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error: error,
    })),

    // --- Load Single Role Reducers ---
    on(RolesActions.loadRoleById, (state) => ({
      ...state,
      isLoading: true,
      selectedRole: null,
      error: null,
    })),

    on(RolesActions.loadRoleByIdSuccess, (state, { role }) => ({
      ...state,
      isLoading: false,
      selectedRole: role,
      error: null,
    })),

    on(RolesActions.loadRoleByIdFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      selectedRole: null,
      error: error,
    })),

    // --- Update Role Reducers ---
    on(RolesActions.updateRole, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),

    on(RolesActions.updateRoleSuccess, (state, { role }) => ({
      ...state,
      isLoading: false,
      selectedRole: role,
    })),

    on(RolesActions.updateRoleFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    on(RolesActions.updateRoleNoChanges, (state) => ({
      ...state,
      isLoading: false,
    })),

    // --- Delete Role Reducers ---
    on(RolesActions.deleteRole, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),

    on(RolesActions.deleteRoleSuccess, (state, { roleId }) => ({
      ...state,
      isLoading: false,
      roles: state.roles.filter((u) => u.id !== roleId),
      totalCount: state.totalCount - 1,
    })),

    on(RolesActions.deleteRoleFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    }))
  ),

  extraSelectors: ({ selectRolesState }) => ({
    selectRolesQuery: createSelector(selectRolesState, (state) => state.query),
  }),
});

// Export renamed selectors for clarity
export const {
  name,
  reducer,
  selectRolesState,
  selectRoles,
  selectAllRoles,
  selectIsLoading: selectRolesIsLoading,
  selectError: selectRolesError,
  selectTotalCount: selectRolesTotalCount,
  selectSelectedRole,
} = rolesFeature;

export const { selectRolesQuery } = rolesFeature;
