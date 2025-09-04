import {
  ApplicationConfig,
  isDevMode,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { initializeAuth } from './app.initializer';
import { authFeature } from './features/auth/store/auth.reducer';
import { AuthEffects } from './features/auth/store/auth.effects';
import { rolesFeature } from './features/roles/store/roles.reducer';
import { RolesEffects } from './features/roles/store/roles.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),

    // 1. Provide the root store. We pass an empty object {}
    //    because our state will be added via feature modules.
    provideStore({
      // Register the auth feature state globally
      [authFeature.name]: authFeature.reducer,
      [rolesFeature.name]: rolesFeature.reducer,
    }),

    // 2. Provide the root effects. Pass an empty array []
    // Register the auth effects globally
    provideEffects([AuthEffects, RolesEffects]),

    // 3. Configure the Store Devtools.
    //    This should only be enabled in development mode.
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode in production
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, // If set to true, will include stack trace for every dispatched action
      traceLimit: 75, // Maximum stack trace frames to be stored (in case trace option is enabled)
    }),

    provideAppInitializer(initializeAuth),
  ],
};
