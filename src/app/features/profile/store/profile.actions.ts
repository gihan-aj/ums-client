import { createActionGroup, emptyProps, props } from "@ngrx/store";

interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
}

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const ProfileActions = createActionGroup({
  source: 'Profile API',
  events: {
    'Update Profile': props<{ payload: UpdateProfilePayload }>(),
    'Update Profile Success': emptyProps(),
    'Update Profile Failure': props<{ error: string }>(),

    'Change Password': props<{ payload: ChangePasswordPayload }>(),
    'Change Password Success': emptyProps(),
    'Change Password Failure': props<{ error: string }>(),
  },
});