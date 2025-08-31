import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { UserDetails } from '../../store/users.state';
import { selectSelectedUser, selectUsersIsLoading } from '../../store/users.reducer';
import { UsersActions } from '../../store/users.actions';
import { NotFoundComponent } from '../../../../shared/components/not-found/not-found.component';

@Component({
  selector: 'app-user-detail-page',
  imports: [CommonModule, RouterLink, ButtonComponent, UserDetailsComponent, NotFoundComponent],
  templateUrl: './user-detail-page.component.html',
  styleUrl: './user-detail-page.component.scss',
})
export class UserDetailPageComponent implements OnInit {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  user$: Observable<UserDetails | null> = this.store.select(selectSelectedUser);
  isLoading$: Observable<boolean> = this.store.select(selectUsersIsLoading);
  isEditMode$: Observable<boolean>;

  constructor() {
    this.isEditMode$ = this.route.url.pipe(
      map((urlSegments) =>
        urlSegments.some((segment) => segment.path === 'edit')
      )
    );
  }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.store.dispatch(UsersActions.loadUserById({ userId }));
    } else {
      // Handle case where ID is missing, maybe navigate back to list
      this.router.navigate(['/users']);
    }
  }

  onSave(updatedUser: any): void {
    console.log('Parent component received save event:', updatedUser);
    // Here we will dispatch the NgRx action to update the user
    // this.store.dispatch(UsersActions.updateUser({ payload: updatedUser }));
  }
}
