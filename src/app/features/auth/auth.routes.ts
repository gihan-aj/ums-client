import { Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { provideState } from "@ngrx/store";
import { authFeature } from "./store/auth.reducer";
import { provideEffects } from "@ngrx/effects";
import { AuthEffects } from "./store/auth.effects";
import { RegisterComponent } from './components/register/register.component';
import { AwaitingActivationComponent } from './components/awaiting-activation/awaiting-activation.component';
import { ActivationComponent } from './components/activation/activation.component';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    // Provide the feature state and effects for all auth-related routes
    providers: [provideState(authFeature), provideEffects([AuthEffects])],
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'awaiting-activation', component: AwaitingActivationComponent },
      { path: 'activate-account', component: ActivationComponent },
      // Default redirect for the auth module
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
];