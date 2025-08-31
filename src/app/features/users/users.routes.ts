import { Routes } from "@angular/router";
import { UserManagementComponent } from "./components/user-management/user-management.component";
import { provideState } from "@ngrx/store";
import { usersFeature } from "./store/users.reducer";
import { provideEffects } from "@ngrx/effects";
import { UserEffects } from "./store/users.effects";
import { UserDetailPageComponent } from './components/user-detail-page/user-detail-page.component';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    component: UserManagementComponent,
    // Provide the feature state and effects only for this feature's routes
    providers: [provideState(usersFeature), provideEffects([UserEffects])],
  },
  {
    path: 'edit/:id',
    component: UserDetailPageComponent,
  },
];
