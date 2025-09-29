export interface PermissionGroup {
  groupName: string;
  permissions: Permission[];
}

export interface Permission {
  id?: number;
  name: string;
  description: string;
}

/**
 * The shape of the Permissions feature state.
 */
export interface PermissionsState {
    permissionGroups: PermissionGroup[];
    isLoading: boolean;
    error: string | null;
}

/**
 * The initial state for the Permissions feature.
 */
export const initialPermissionsState: PermissionsState = {
    permissionGroups: [],
    isLoading: false,
    error: null
}
