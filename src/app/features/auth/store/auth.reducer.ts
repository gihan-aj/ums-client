import { createFeature, createReducer, on } from '@ngrx/store';
import { initialAuthState, User } from './auth.state';
import { AuthActions } from './auth.actions';
import { jwtDecode } from 'jwt-decode';

export const authFeature = createFeature({
  name: 'auth', // The key for this state slice in the global store
  reducer: createReducer(
    initialAuthState,

    // Handle the login action
    on(AuthActions.login, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),

    // Handle the login action
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

    // Handle the Login Failure action
    on(AuthActions.loginFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error: error,
      user: null,
      accessToken: null,
      tokenExpiry: null,
    })),

    // Handle the Logout action
    on(AuthActions.logout, () => initialAuthState)
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
