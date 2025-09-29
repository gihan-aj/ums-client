import { environment } from '../../../../environments/environment';
import { Filter } from '../../../shared/models/filter.model';
import { Permission } from '../../permissions/store/permissions.state';

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface RolesQuery {
  page: number;
  pageSize: number;
  sortColumn?: string;
  sortOrder?: 'asc' | 'desc';
  filters: Filter[];
}

export interface RolesState {
  roles: Role[];
  allRoles: Role[];
  totalCount: number;
  query: RolesQuery;
  isLoading: boolean;
  error: string | null;
  selectedRole: Role | null;
}

export const initialRolesState: RolesState = {
  roles: [],
  allRoles: [],
  totalCount: 0,
  query: {
    page: 1,
    pageSize: environment.defaultPageSize,
    filters: [],
  },
  isLoading: false,
  error: null,
  selectedRole: null,
};
