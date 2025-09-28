import { Routes } from "@angular/router";
import { RoleManagementComponent } from "./components/role-management/role-management.component";
import { permissionGuard } from "../../core/guards/permission.guard";

export const ROLES_ROUTES: Routes = [
    {
        path: '',
        component: RoleManagementComponent,
        canActivate: [permissionGuard],
        data:{ permission: 'roles:', checkType: 'startsWith' }
    }
]