import { createFeature, createReducer, on } from '@ngrx/store';
import { initialProfileState } from './profile.state';
import { ProfileActions } from './profile.actions';

export const profileFeature = createFeature({
  name: 'profile',
  reducer: createReducer(
    initialProfileState,

    on(
      ProfileActions.updateProfile,
      ProfileActions.changePassword,
      (state) => ({
        ...state,
        isLoading: true,
        error: null,
      })
    ),
    on(
      ProfileActions.updateProfileSuccess,
      ProfileActions.changePasswordSuccess,
      (state) => ({
        ...state,
        isLoading: false,
        error: null,
      })
    ),
    on(
      ProfileActions.updateProfileFailure,
      ProfileActions.changePasswordFailure,
      (state, { error }) => ({
        ...state,
        isLoading: false,
        error,
      })
    )
  ),
});

export const {
  selectIsLoading: selectProfileIsLoading,
  selectError: selectProfileError,
} = profileFeature;
