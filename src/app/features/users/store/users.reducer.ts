import { createFeature, createReducer, on } from "@ngrx/store";
import { initialUsersState } from "./users.state";
import { UsersActions } from "./users.actions";

export const usersFeature = createFeature({
  name: 'users',
  reducer: createReducer(
    initialUsersState,

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
    )
  ),
});

// Export the generated selectors, renaming them for clarity
const {
  selectUsers,
  selectTotalCount,
  selectQuery,
  selectIsLoading,
  selectError,
} = usersFeature;

export {
  selectUsers,
  selectTotalCount,
  selectQuery as selectUserQuery,
  selectIsLoading as selectUsersIsLoading,
  selectError as selectUsersError,
};