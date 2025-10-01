import { Directive, inject, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, Subject, takeUntil } from 'rxjs';
import {
  selectIsRefreshing,
  selectUserPermissions,
} from '../../features/auth/store/auth.reducer';

@Directive({
  selector: '[appHasPermission]',
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  private store = inject(Store);
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private destroy$ = new Subject<void>();

  private requiredPermission!: string;
  private checkType: 'exact' | 'startsWith' = 'exact';

  @Input('appHasPermission')
  set permission(
    config: string | [string, 'exact' | 'startsWith'] | undefined | null
  ) {
    if (Array.isArray(config)) {
      // Handle array syntax, e.g., [*appHasPermission]="['users:', 'startsWith']"
      this.requiredPermission = config[0];
      this.checkType = config[1];
    } else {
      // Handle simple string syntax, e.g., *appHasPermission="'users:read'"
      this.requiredPermission = config ?? '';
      this.checkType = 'exact';
    }
  }

  ngOnInit(): void {
    combineLatest([
      this.store.select(selectUserPermissions),
      this.store.select(selectIsRefreshing),
    ])
      .pipe(
        map(([permissions, isRefreshing]) => {
          // if a refresh is happening, do not make any changes.
          // This prevents the element from dissapearing.
          if (isRefreshing) {
            return this.viewContainer.length > 0; // Return true if it's already visible
          }

          // Otherwise, run the permission check
          return this.checkHasPermission(permissions);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((hasPermission) => {
        this.updateView(hasPermission);
      });
  }

  private updateView(hasPermission: boolean): void {
    if (hasPermission) {
      if (!this.viewContainer.length) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    } else {
      this.viewContainer.clear();
    }
  }

  private checkHasPermission(userPermissions: string[]): boolean {
    if (!this.requiredPermission) {
      return false;
    }
    if (this.checkType === 'exact') {
      return userPermissions.includes(this.requiredPermission);
    } else if (this.checkType === 'startsWith') {
      return userPermissions.some((perm) =>
        perm.startsWith(this.requiredPermission)
      );
    }
    return false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
