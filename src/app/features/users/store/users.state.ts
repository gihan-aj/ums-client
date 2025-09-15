import { environment } from "../../../../environments/environment";
import { Filter } from '../../../shared/models/filter.model';
import { Permission, Role } from '../../roles/store/roles.state';

// --- Interfaces for User Lists ---

/**
 * Interface representing a single user object from the API.
 */
export interface User {
  id: string;
  userCode: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAtUtc: string;
  lastLoginAtUtc: string | null;
}

export interface UserDetails extends User {
  roles: Role[];
  permissions: Permission[];
}

/**
 * Interface representing the query parameters for fetching users.
 */
export interface UserQuery {
  page: number;
  pageSize: number;
  sortColumn?: string;
  sortOrder?: 'asc' | 'desc';
  filters: Filter[];
}

/**
 * The shape of our Users feature state.
 */
export interface UsersState {
  users: User[];
  totalCount: number;
  query: UserQuery;
  isLoading: boolean;
  error: string | null;
  selectedUser: UserDetails | null;
}

/**
 * The initial state for the Users feature when the app loads.
 */
export const initialUsersState: UsersState = {
  users: [],
  totalCount: 0,
  query: {
    page: 1, // Pages are typically 1-based for user display
    pageSize: environment.defaultPageSize,
    filters: []
  },
  isLoading: false,
  error: null,
  selectedUser: null,
};
