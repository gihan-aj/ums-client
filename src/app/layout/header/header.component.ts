import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUser } from '../../features/auth/store/auth.reducer';
import { filter, Observable } from 'rxjs';
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

  toggleSidebar() {
    this.layoutService.toggleSidebar();
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
