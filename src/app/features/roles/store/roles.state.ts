export interface Role {
  id: number;
  name: string;
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
    