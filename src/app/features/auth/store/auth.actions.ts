import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { User } from "./auth.state";

interface RegisterPayload {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
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
  },
});