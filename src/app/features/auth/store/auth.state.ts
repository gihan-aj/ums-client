export interface User {
  userId: string;
  email: string;
  userCode: string;
  given_name: string; // From the token claims
  family_name: string; // From the token claims
  role: string;
  permissions: string[];
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  tokenExpiry: Date | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
}

// This is the initial state when the app loads
export const initialAuthState: AuthState = {
  user: null,
  accessToken: null,
  tokenExpiry: null,
  isLoading: false,
  isRefreshing: false,
  error: null,
};