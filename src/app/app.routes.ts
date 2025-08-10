import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  // Redirect the root path to the login page
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  // We will add a route for the main application layout later
  // {
  //   path: '',
  //   component: MainLayoutComponent,
  //   canActivate: [AuthGuard], // Protect this route
  //   children: [
  //     // ... dashboard, users, etc.
  //   ]
  // }
];
