import { AfterViewInit, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectAuthIsLoading,
  selectTokenExpiry,
  selectUser,
} from '../../features/auth/store/auth.reducer';
import { asyncScheduler, filter, map, Observable, observeOn } from 'rxjs';
import { AuthActions } from '../../features/auth/store/auth.actions';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../core/services/layout.service';
import { RouterLink } from '@angular/router';
import { DropdownComponent } from '../../shared/components/dropdown/dropdown.component';
import { HasPermissionDirective } from '../../core/directives/has-permission.directive';
import { DialogService } from '../../core/services/dialog.service';
import { User } from '../../features/auth/store/auth.state';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterLink,
    DropdownComponent,
    HasPermissionDirective,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements AfterViewInit {
  private store = inject(Store);
  private layoutService = inject(LayoutService);
  private dialogService = inject(DialogService);

  user$: Observable<User | null> = this.store.select(selectUser);
  isMobile$: Observable<boolean> = this.layoutService.isMobile$;
  // tokenExpiry$ = this.store.select(selectTokenExpiry).pipe(
  //   filter((expiry) => !!expiry),
  //   map((expiry) => new Date(expiry))
  // );

  isUserLoggedIn = false;

  ngAfterViewInit(): void {
    this.user$.subscribe((user) => {
      if (!!user) {
        this.isUserLoggedIn = true;
      } else {
        this.isUserLoggedIn = false;
      }
    });
  }

  toggleSidebar() {
    this.layoutService.toggleSidebar();
  }

  logout() {
    this.dialogService
      .openConfirmationDialog({
        title: 'Confirm Logout',
        message: 'Are you sure you want to logout?',
        confirmButtonText: 'Logout',
        confirmButtonColor: 'danger',
        type: 'warning',
      })
      .pipe(filter((confirmed) => confirmed === true))
      .subscribe(() => {
        this.store.dispatch(AuthActions.logout());
      });
  }
}
