import { Directive, inject, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { selectUserPermissions } from '../../features/auth/store/auth.reducer';

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
  private userPermissions: string[] = [];

  @Input('appHasPermission')
  set permission(value: string) {
    this.requiredPermission = value;
    this.updateView();
  }

  // An optional input to change the check type, e.g., [appHasPermissionCheckType]="'startsWith'"
  @Input('appHasPermissionCheckType')
  set permissionCheckType(value: 'exact' | 'startsWith') {
    this.checkType = value;
    this.updateView();
  }

  ngOnInit(): void {
    this.store.select(selectUserPermissions)
      .pipe(takeUntil(this.destroy$))
      .subscribe(permissiions => {
        this.userPermissions = permissiions;
        this.updateView();
      });
  }

  private updateView(): void {
    if(!this.requiredPermission){
      this.viewContainer.clear();
      return;
    }

    if(this.checkHasPermission()){
      // If the user has permission and the view isn't already created, create it.
      if (!this.viewContainer.length) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        // If the user does not have permission, clear the view.
        this.viewContainer.clear();
      }
    }
  }

  private checkHasPermission(): boolean {
    if(this.checkType === 'exact'){
      return this.userPermissions.includes(this.requiredPermission);
    }else if(this.checkType === 'startsWith') {
      return this.userPermissions.some(perm => perm.startsWith(this.requiredPermission))
    }
    return false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete()
  }
}
