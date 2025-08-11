import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { User } from "./auth.state";

export const AuthActions = createActionGroup({
  source: 'Auth API',
  events: {
    Login: props<{
      payload: { email: string; password: string; deviceId: string };
    }>(),
    'Login Success': props<{
      user: User;
      accessToken: string;
      tokenExpiryUtc: string;
    }>(),
    'Login Failure': props<{ error: string }>(),
    'Logout': emptyProps(),
  },
});