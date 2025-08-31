import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User, UserDetails, UserQuery } from './users.state';

interface AddUserPayload {
  firstName: string;
  lastName: string;
  email: string;
}

export const UsersActions = createActionGroup({
  source: 'Users API',
  events: {
    // Action dispatched to load users, optionally with new query params
    'Load Users': props<{ query?: Partial<UserQuery> }>(),

    // Action dispatched when the API call is successful
    'Load Users Success': props<{ users: User[]; totalCount: number }>(),

    // Action dispatched when the API call fails
    'Load Users Failure': props<{ error: string }>(),

    // Action to update the current query (e.g., for pagination or sorting)
    'Update User Query': props<{ query: Partial<UserQuery> }>(),

    'Add User': props<{ payload: AddUserPayload }>(),
    'Add User Success': props<{ userId: string }>(),
    'Add User Failure': props<{ error: string }>(),

    'Activate User': props<{ userId: string }>(),
    'Activate User Status Success': props<{ userId: string }>(),
    'Activate User Status Failure': props<{ error: string }>(),

    'Deactivate User': props<{ userId: string }>(),
    'Deactivate User Status Success': props<{ userId: string }>(),
    'Deactivate User Status Failure': props<{ error: string }>(),

    // --- Fetching a single user ---
    'Load User By Id': props<{ userId: string }>(),
    'Load User By Id Success': props<{ user: UserDetails }>(),
    'Load User By Id Failure': props<{ error: string }>(),
  },
});
