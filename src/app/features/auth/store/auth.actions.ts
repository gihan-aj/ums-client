import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { User } from "./auth.state";

interface RegisterPayload {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

interface SetInitialPasswordPayload {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

interface ResetPasswordPayload {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export const AuthActions = createActionGroup({
  source: 'Auth API',
  events: {
    // --- Login Actions ---
    Login: props<{
      payload: { email: string; password: string; deviceId: string };
    }>(),
    'Login Success': props<{
      user: User;
      accessToken: string;
      tokenExpiryUtc: string;
    }>(),
    'Login Failure': props<{ error: string }>(),
    Logout: props<{ navigateToLogin?: boolean }>(),

    // --- Registration Actions ---
    Register: props<{ payload: RegisterPayload }>(),
    'Register Success': props<{ successMessage: string }>(),
    'Register Failure': props<{ error: string }>(),

    // --- Activation Actions ---
    'Activate Account': props<{ token: string; email: string }>(),
    'Set Initial Password': props<{ payload: SetInitialPasswordPayload }>(),
    'Activation Success': props<{ successMessage: string }>(),
    'Activation Failure': props<{ error: string }>(),

    // --- New Resend Activation Actions ---
    'Resend Activation': props<{ email: string }>(),
    'Resend Activation Success': props<{ successMessage: string }>(),
    'Resend Activation Failure': props<{ error: string }>(),

    // --- Request Password Request Actions ---
    'Request Password Reset': props<{ email: string }>(),
    'Request Password Reset Success': props<{ successMessage: string }>(),
    'Request Password Reset Failure': props<{ error: string }>(),

    // --- Request Password Request Actions ---
    'Reset Password': props<{ payload: ResetPasswordPayload }>(),
    'Reset Password Success': props<{ successMessage: string }>(),
    'Reset Password Failure': props<{ error: string }>(),

    // --- Refresh Token Actions ---
    'Refresh Token': emptyProps(),
    'Refresh Token Success': props<{
      user: User;
      accessToken: string;
      tokenExpiryUtc: string;
    }>(),
    'Refresh Token Failure': emptyProps(), // No error message needed, will just log out
  },
});