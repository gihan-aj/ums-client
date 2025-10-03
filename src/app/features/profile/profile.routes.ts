import { Routes } from "@angular/router";

import { ProfileLayoutComponent } from "./components/profile-layout/profile-layout.component";
import { ProfileDetailsComponent } from "./components/profile-details/profile-details.component";
import { permissionGuard } from "../../core/guards/permission.guard";
import { ChangePasswordComponent } from "./components/change-password/change-password.component";

import { provideState } from "@ngrx/store";
import { profileFeature } from "./store/profile.reducer";
import { provideEffects } from "@ngrx/effects";
import { ProfileEffects } from "./store/profile.effects";

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    component: ProfileLayoutComponent,
    providers: [provideState(profileFeature), provideEffects([ProfileEffects])],
    children: [
      {
        path: 'details',
        component: ProfileDetailsComponent,
        canActivate: [permissionGuard],
        data: { permission: 'profile:read' },
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
        canActivate: [permissionGuard],
        data: { permission: 'profile:change_password' },
      },
      { path: '', redirectTo: 'details', pathMatch: 'full' },
    ],
  },
];