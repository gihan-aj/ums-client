import { Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { provideState } from "@ngrx/store";
import { authFeature } from "./store/auth.reducer";
import { provideEffects } from "@ngrx/effects";
import { AuthEffects } from "./store/auth.effects";

export const AUTH_ROUTES: Routes = [
  {
    // This is the new default route for this feature module.
    // If the user lands on the root path, they will be redirected to 'login'.
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    // Provide the feature state and effects only for this feature's routes
    providers: [provideState(authFeature), provideEffects([AuthEffects])],
  },
  // We will add routes for register, forgot-password, etc. here later
];