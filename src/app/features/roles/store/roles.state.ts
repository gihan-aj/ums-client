export interface Permission {
  name: string;
  description: string;
}

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

export interface RolesState {
  roles: Role[];
  isLoading: boolean;
  error: string | null;
}

export const initialRolesState: RolesState = {
  roles: [],
  isLoading: false,
  error: null,
};
