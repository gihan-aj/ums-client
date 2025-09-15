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
    // --- UI Events ---
    'Set Users Search Term': props<{ searchTerm: string }>(),

    // --- Load Users List Actions ---
    'Load Users': props<{ query?: Partial<UserQuery> }>(),
    'Load Users Success': props<{ users: User[]; totalCount: number }>(),
    'Load Users Failure': props<{ error: string }>(),

    // Action to update the current query (e.g., for pagination or sorting)
    'Update User Query': props<{ query: Partial<UserQuery> }>(),

    // --- Add User Actions ---
    'Add User': props<{ payload: AddUserPayload }>(),
    'Add User Success': props<{ userId: string }>(),
    'Add User Failure': props<{ error: string }>(),

    // --- Status Change Actions ---
    'Activate User': props<{ userId: string }>(),
    'Activate User Status Success': props<{ userId: string }>(),
    'Activate User Status Failure': props<{ error: string }>(),

    'Deactivate User': props<{ userId: string }>(),
    'Deactivate User Status Success': props<{ userId: string }>(),
    'Deactivate User Status Failure': props<{ error: string }>(),

    // --- Load Single User Actions ---
    'Load User By Id': props<{ userId: string }>(),
    'Load User By Id Success': props<{ user: UserDetails }>(),
    'Load User By Id Failure': props<{ error: string }>(),

    // --- Update User Actions ---
    'Update User': props<{
      userId: string;
      payload: any;
    }>(),
    'Update User Success': props<{ user: UserDetails }>(),
    'Update User Failure': props<{ error: string }>(),
    'Update User No Changes': emptyProps(),

    // --- Delete User Actions ---
    'Delete User': props<{ userId: string }>(),
    'Delete User Success': props<{ userId: string }>(),
    'Delete User Failure': props<{ error: string }>(),
  },
});
