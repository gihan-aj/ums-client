import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { initialUsersState } from './users.state';
import { UsersActions } from './users.actions';

export const usersFeature = createFeature({
  name: 'users',
  reducer: createReducer(
    initialUsersState,

    on(UsersActions.setUsersSearchTerm, (state, { searchTerm }) => ({
      ...state,
      query: {
        ...state.query,
        page: 1,
        filters: searchTerm
          ? [
              {
                columnName: 'firstName',
                operator: 'contains',
                value: searchTerm,
              },
              {
                columnName: 'lastName',
                operator: 'contains',
                value: searchTerm,
              },
              { columnName: 'email', operator: 'contains', value: searchTerm },
            ]
          : [],
      },
    })),

    // --- Load Users List Reducers ---
    on(UsersActions.loadUsers, (state, { query }) => ({
      ...state,
      isLoading: true,
      error: null,
      // Merge new query params with existing ones
      query: { ...state.query, ...query },
    })),

    on(UsersActions.loadUsersSuccess, (state, { users, totalCount }) => ({
      ...state,
      users: users,
      totalCount: totalCount,
      isLoading: false,
    })),

    on(UsersActions.loadUsersFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error: error,
    })),

    on(UsersActions.updateUserQuery, (state, { query }) => ({
      ...state,
      query: { ...state.query, ...query },
    })),

    // --- Add User Reducers ---
    on(UsersActions.addUser, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),

    on(UsersActions.addUserSuccess, (state) => ({
      ...state,
      isLoading: false,
      error: null,
    })),

    on(UsersActions.addUserFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error: error,
    })),

    // --- User Status Reducers ---
    on(UsersActions.activateUser, UsersActions.deactivateUser, (state) => ({
      ...state,
      // We can set isLoading to true to show a global loader,
      // or we can handle loading state per-row in the component.
      // For now, we'll keep it simple.
    })),

    on(UsersActions.activateUserStatusSuccess, (state, { userId }) => ({
      ...state,
      // Find the user in the array and replace it with the updated version
      users: state.users.map((user) =>
        user.id === userId ? { ...user, isActive: true } : user
      ),
    })),

    on(UsersActions.deactivateUserStatusSuccess, (state, { userId }) => ({
      ...state,
      // Find the user in the array and replace it with the updated version
      users: state.users.map((user) =>
        user.id === userId ? { ...user, isActive: false } : user
      ),
    })),

    on(
      UsersActions.activateUserStatusFailure,
      UsersActions.deactivateUserStatusFailure,
      (state, { error }) => ({
        ...state,
        error: error, // Optionally store the error
      })
    ),

    // --- Load Single User Reducers ---
    on(UsersActions.loadUserById, (state) => ({
      ...state,
      isLoading: true,
      selectedUser: null,
      error: null,
    })),

    on(UsersActions.loadUserByIdSuccess, (state, { user }) => ({
      ...state,
      isLoading: false,
      selectedUser: user,
      error: null,
    })),

    on(UsersActions.loadUserByIdFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      selectedUser: null,
      error: error,
    })),

    // --- Update User Reducers ---
    on(UsersActions.updateUser, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),

    on(UsersActions.updateUserSuccess, (state, { user }) => ({
      ...state,
      isLoading: false,
      selectedUser: user,
    })),

    on(UsersActions.updateUserFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    on(UsersActions.updateUserNoChanges, (state) => ({
      ...state,
      isLoading: false,
    })),

    // --- Delete User Reducers ---
    on(UsersActions.deleteUser, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),

    on(UsersActions.deleteUserSuccess, (state, { userId }) => ({
      ...state,
      isLoading: false,
      users: state.users.filter((u) => u.id !== userId),
      totalCount: state.totalCount - 1,
    })),

    on(UsersActions.deleteUserFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    }))
  ),

  extraSelectors: ({ selectUsersState }) => ({
    selectUserQuery: createSelector(selectUsersState, (state) => state.query),
  }),
});

// --- Selectors ---
export const {
  name,
  reducer,
  selectUsersState,
  selectUsers,
  selectIsLoading: selectUsersIsLoading,
  selectError: selectUsersError,
  selectTotalCount: selectUsersTotalCount,
  selectSelectedUser,
} = usersFeature;

export const { selectUserQuery } = usersFeature;
