import { Routes } from "@angular/router";
import { RoleManagementComponent } from "./components/role-management/role-management.component";
import { permissionGuard } from "../../core/guards/permission.guard";
import { RoleDetailComponent } from './components/role-detail/role-detail.component';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { permissionsFeature } from '../permissions/store/permissions.reducer';
import { PermissionEffects } from '../permissions/store/permissions.effects';

export const ROLES_ROUTES: Routes = [
  {
    path: '',
    component: RoleManagementComponent,
    providers: [
      provideState(permissionsFeature),
      provideEffects([PermissionEffects]),
    ],
    canActivate: [permissionGuard],
    data: { permission: 'roles:', checkType: 'startsWith' },
  },
  {
    path: 'add',
    component: RoleDetailComponent,
    canActivate: [permissionGuard],
    data: { permission: 'roles:read' },
  },
  {
    path: 'edit/:id',
    component: RoleDetailComponent,
    canActivate: [permissionGuard],
    data: { permission: 'roles:update' },
  },
];