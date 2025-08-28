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
    }))
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