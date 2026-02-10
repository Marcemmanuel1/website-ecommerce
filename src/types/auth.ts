export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  newsletter: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}
