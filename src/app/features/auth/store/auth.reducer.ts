import { createFeature, createReducer, on } from '@ngrx/store';
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
      const user: User = {
        userId: decodedToken.uid,
        email: decodedToken.email,
        userCode: decodedToken.userCode,
        given_name: decodedToken.given_name,
        family_name: decodedToken.family_name,
        role: decodedToken.role,
        permissions: decodedToken.permission,
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

    on(AuthActions.logout, () => initialAuthState),

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
    }))
  ),
});

// Export the generated selectors for easy use in components
const {
  selectUser,
  selectAccessToken,
  selectIsLoading,
  selectError,
  selectAuthState,
} = authFeature;

export {
  selectUser,
  selectAccessToken,
  selectIsLoading as selectAuthIsLoading,
  selectError as selectAuthError,
  selectAuthState,
};
