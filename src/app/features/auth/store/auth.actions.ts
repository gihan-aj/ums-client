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
    Logout: emptyProps(),

    // --- Registration Actions ---
    Register: props<{ payload: RegisterPayload }>(),
    'Register Success': props<{ successMessage: string }>(),
    'Register Failure': props<{ error: string }>(),

    // --- Activation Actions ---
    'Activate Account': props<{ token: string; email: string }>(),
    'Set Initial Password': props<{ payload: SetInitialPasswordPayload }>(),
    'Activation Success': props<{ successMessage: string }>(),
    'Activation Failure': props<{ error: string }>(),
  },
});