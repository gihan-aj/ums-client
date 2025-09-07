import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectTokenExpiry,
  selectUser,
} from '../../features/auth/store/auth.reducer';
import { filter, map, Observable } from 'rxjs';
import { AuthActions } from '../../features/auth/store/auth.actions';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../core/services/layout.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private store = inject(Store);
  private layoutService = inject(LayoutService);

  user$ = this.store.select(selectUser).pipe(filter((user) => !!user));
  isMobile$: Observable<boolean> = this.layoutService.isMobile$;
  // tokenExpiry$ = this.store.select(selectTokenExpiry).pipe(
  //   filter((expiry) => !!expiry),
  //   map((expiry) => new Date(expiry))
  // );

  toggleSidebar() {
    this.layoutService.toggleSidebar();
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
