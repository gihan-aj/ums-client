import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  // --- Public Authentication Routes ---
  // These routes are for users who are not logged in.
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },

  // --- Protected Application Routes ---
  // These routes are wrapped in the MainLayoutComponent and protected by the authGuard.
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard], // Protect this whole section
    children: [
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'users',
        loadChildren: () =>
          import('./features/users/users.routes').then((m) => m.USERS_ROUTES),
      },
      // Redirect the root path of the protected area to the dashboard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  // Fallback route if no other route matches
  {
    path: '**',
    redirectTo: '/auth/login',
  },
];
