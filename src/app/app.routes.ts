import { Routes } from '@angular/router';

export const routes: Routes = [
  // Lazy-load the authentication feature routes.
  // The router will now look inside AUTH_ROUTES for any path starting from root.
  {
    path: '', // Corrected: This path now correctly points to the lazy-loaded module.
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },

  // We can add a wildcard route here for a 404 page later.
  // The primary redirect is now handled inside auth.routes.ts.
];
