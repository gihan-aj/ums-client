import { Routes } from "@angular/router";
import { RoleManagementComponent } from "./components/role-management/role-management.component";
import { permissionGuard } from "../../core/guards/permission.guard";
import { RoleDetailComponent } from './components/role-detail/role-detail.component';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { permissionsFeature } from '../permissions/store/permissions.reducer';
import { PermissionEffects } from '../permissions/store/permissions.effects';
import { rolesFeature } from './store/roles.reducer';
import { RolesEffects } from './store/roles.effects';

export const ROLES_ROUTES: Routes = [
  {
    path: '',
    // Provide both feature states and effects for these routes
    providers: [
      provideState(rolesFeature),
      provideState(permissionsFeature),
      provideEffects([RolesEffects, PermissionEffects]),
    ],
    children: [
      {
        path: '',
        component: RoleManagementComponent,
        canActivate: [permissionGuard],
        data: { permission: 'roles:read' },
      },
      {
        path: 'add',
        component: RoleDetailComponent,
        canActivate: [permissionGuard],
        data: { permission: 'roles:create' },
      },
      {
        path: 'edit/:id',
        component: RoleDetailComponent,
        canActivate: [permissionGuard],
        data: { permission: 'roles:update' },
      },
      {
        path: 'view/:id',
        component: RoleDetailComponent,
        canActivate: [permissionGuard],
        data: { permission: 'roles:read' },
      },
    ],
  },
];