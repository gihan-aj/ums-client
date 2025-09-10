import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { initialAuthState, User } from './auth.state';
import { AuthActions } from './auth.actions';
import { jwtDecode } from 'jwt-decode';

export const authFeature = createFeature({
  name: 'auth', // The key for this state slice in the global store

  reducer: createReducer(
    initialAuthState,

    // --- Login Reducers ---
    on(AuthActions.login, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),

    on(AuthActions.loginSuccess, (state, { accessToken, tokenExpiryUtc }) => {
      // Decode the token to get user details not in the main response body
      const decodedToken: any = jwtDecode(accessToken);
      const permissionsClaim = decodedToken.permission;
      const user: User = {
        userId: decodedToken.uid,
        email: decodedToken.email,
        userCode: decodedToken.userCode,
        given_name: decodedToken.given_name,
        family_name: decodedToken.family_name,
        role: decodedToken.role,
        permissions: Array.isArray(permissionsClaim)
          ? permissionsClaim
          : permissionsClaim
          ? [permissionsClaim]
          : [],
      };

      return {
        ...state,
        user: user,
        accessToken: accessToken,
        tokenExpiry: new Date(tokenExpiryUtc),
        isLoading: false,
        error: null,
      };
    }),

    on(AuthActions.loginFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error: error,
      user: null,
      accessToken: null,
      tokenExpiry: null,
    })),

    // --- Logout Reducers (Refactored) ---
    on(AuthActions.logout, (state) => ({
      ...state,
      isLoading: true, // Show a loading state if needed
    })),

    // Both success and failure result in the user being logged out
    on(
      AuthActions.logoutSuccess,
      AuthActions.logoutFailure,
      () => initialAuthState
    ),

    // --- Registration Reducers ---
    on(AuthActions.register, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(AuthActions.registerSuccess, (state) => ({
      ...state,
      isLoading: false, // Registration is done, so loading is false
    })),
    on(AuthActions.registerFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error: error,
    })),

    // --- Activation Reducers ---
    on(
      AuthActions.activateAccount,
      AuthActions.setInitialPassword,
      (state) => ({
        ...state,
        isLoading: true,
        error: null,
      })
    ),
    on(AuthActions.activationSuccess, (state) => ({
      ...state,
      isLoading: false,
    })),
    on(AuthActions.activationFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error: error,
    })),

    // ---Resend Activation Reducers ---
    on(AuthActions.resendActivation, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(AuthActions.resendActivationSuccess, (state) => ({
      ...state,
      isLoading: false,
    })),
    on(AuthActions.resendActivationFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error: error,
    })),

    // ---Request Password Reset Reducers ---
    on(AuthActions.requestPasswordReset, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(AuthActions.requestPasswordResetSuccess, (state) => ({
      ...state,
      isLoading: false,
    })),
    on(AuthActions.requestPasswordResetFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error: error,
    })),

    // --- Refresh token Reducers ---
    on(AuthActions.refreshToken, (state) => ({
      ...state,
      accessToken: null,
      tokenExpiry: null,
      isLoading: true,
      error: null,
    })),

    on(
      AuthActions.refreshTokenSuccess,
      (state, { accessToken, tokenExpiryUtc }) => {
        // Decode the token to get user details not in the main response body
        const decodedToken: any = jwtDecode(accessToken);
        const permissionsClaim = decodedToken.permission;
        const user: User = {
          userId: decodedToken.uid,
          email: decodedToken.email,
          userCode: decodedToken.userCode,
          given_name: decodedToken.given_name,
          family_name: decodedToken.family_name,
          role: decodedToken.role,
          permissions: Array.isArray(permissionsClaim)
            ? permissionsClaim
            : permissionsClaim
            ? [permissionsClaim]
            : [],
        };

        return {
          ...state,
          user: user,
          accessToken: accessToken,
          tokenExpiry: new Date(tokenExpiryUtc),
          isLoading: false,
          error: null,
        };
      }
    ),

    on(AuthActions.refreshTokenFailure, (state) => ({
      ...state,
      isLoading: false,
      error: 'Your session has expired. Please sign in again.',
    }))
  ),
});

// Create a new selector specifically for permissions
export const selectUserPermissions = createSelector(
  authFeature.selectUser,
  (user) => user?.permissions ?? [] // Return permissions or an empty array
);

// Export the generated selectors for easy use in components
const {
  selectUser,
  selectAccessToken,
  selectTokenExpiry,
  selectIsLoading,
  selectError,
  selectAuthState,
} = authFeature;

export {
  selectUser,
  selectAccessToken,
  selectTokenExpiry,
  selectIsLoading as selectAuthIsLoading,
  selectError as selectAuthError,
  selectAuthState,
};
