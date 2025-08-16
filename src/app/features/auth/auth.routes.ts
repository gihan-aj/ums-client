import { Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { provideState } from "@ngrx/store";
import { authFeature } from "./store/auth.reducer";
import { provideEffects } from "@ngrx/effects";
import { AuthEffects } from "./store/auth.effects";
import { RegisterComponent } from './components/register/register.component';
import { AwaitingActivationComponent } from './components/awaiting-activation/awaiting-activation.component';
import { ActivationComponent } from './components/activation/activation.component';
import { ResendActivationComponent } from './components/resend-activation/resend-activation.component';
import { RequestPasswordResetComponent } from './components/request-password-reset/request-password-reset.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'awaiting-activation', component: AwaitingActivationComponent },
      { path: 'activate-account', component: ActivationComponent },
      { path: 'resend-activation', component: ResendActivationComponent },
      {
        path: 'request-password-reset',
        component: RequestPasswordResetComponent,
      },
      { path: 'reset-password', component: ResetPasswordComponent },
      // Default redirect for the auth module
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
];