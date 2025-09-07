import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NotificationService } from '../services/notification.service';
import { selectUserPermissions } from '../../features/auth/store/auth.reducer';
import { map, take } from 'rxjs';

/**
 * A functional route guard to check for user permissions.
 * It reads the required permission from the route's `data` property.
 * * --- Usage in Routing ---
 * * // For an exact match:
 * data: { permission: 'users:update' }
 * * // To check if the user has ANY permission starting with 'users:':
 * data: { permission: 'users:', checkType: 'startsWith' }
 */
export const permissionGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  const requiredPermission = route.data['permission'] as string;
  const checkType = route.data['checkType'] as 'exact' | 'startsWith' | undefined ?? 'exact';

  if (!requiredPermission) {
    console.error(
      'Permission guard configured on a route without a required permission in data property.'
    );
    return false;
  }

  return store.select(selectUserPermissions).pipe(
    take(1),
    map((userPermissions) => {
      let hasPermission = false;

      if(checkType === 'exact'){
        hasPermission = userPermissions.includes(requiredPermission);
      }
      else if(checkType === 'startsWith'){
        hasPermission = userPermissions.some(p => p.startsWith(requiredPermission))
      }

      if(hasPermission){
        return true;
      }
      else{
        // If permission is not found, show a notification and redirect
        notificationService.showError(
          'You do not have permission to access this page.'
        );
        router.navigate(['/dashboard']); // Redirect to a safe default page
        return false;
      }
    })
  );
};
