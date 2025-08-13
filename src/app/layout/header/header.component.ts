import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUser } from '../../features/auth/store/auth.reducer';
import { filter } from 'rxjs';
import { AuthActions } from '../../features/auth/store/auth.actions';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private store = inject(Store);
  user$ = this.store.select(selectUser).pipe(filter((user) => !!user));

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
