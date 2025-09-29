import { Routes } from "@angular/router";
import { UserManagementComponent } from "./components/user-management/user-management.component";
import { provideState } from "@ngrx/store";
import { usersFeature } from "./store/users.reducer";
import { provideEffects } from "@ngrx/effects";
import { UserEffects } from "./store/users.effects";
import { UserDetailPageComponent } from './components/user-detail-page/user-detail-page.component';
import { permissionGuard } from '../../core/guards/permission.guard';
import { rolesFeature } from '../roles/store/roles.reducer';
import { RolesEffects } from '../roles/store/roles.effects';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    component: UserManagementComponent,
    // Provide the feature state and effects only for this feature's routes
    providers: [
      provideState(usersFeature),
      provideState(rolesFeature),
      provideEffects([UserEffects, RolesEffects]),
    ],
    canActivate: [permissionGuard],
    data: { permission: 'users:', checkType: 'startsWith' },
  },
  {
    path: 'view/:id',
    component: UserDetailPageComponent,
    canActivate: [permissionGuard],
    data: { permission: 'users:read' },
  },
  {
    path: 'edit/:id',
    component: UserDetailPageComponent,
    canActivate: [permissionGuard],
    data: { permission: 'users:update' },
  },
];
