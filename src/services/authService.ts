import type {
  LoginFormData,
  RegisterFormData,
  AuthResponse,
  User,
} from "../types/auth";

// Correction pour Vite
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Configuration des headers
const getHeaders = (token?: string) => ({
  "Content-Type": "application/json",
  ...(token && { Authorization: `Bearer ${token}` }),
});

// Gestion des erreurs API
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: "Une erreur est survenue",
    }));
    throw new Error(errorData.message || `Erreur ${response.status}`);
  }
  return response.json();
};

// Services d'authentification
export const authService = {
  // Connexion
  async login(credentials: LoginFormData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(credentials),
      });

      const data = await handleResponse(response);

      // Stocker le token dans le localStorage
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // Inscription
  async register(userData: RegisterFormData): Promise<AuthResponse> {
    try {
      // Préparer les données pour l'API (retirer confirmPassword)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...apiData } = userData;

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(apiData),
      });

      const data = await handleResponse(response);

      // Stocker le token dans le localStorage
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  },

  // Déconnexion
  logout(): void {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  },

  // Vérification du token
  async verifyToken(token: string): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: "GET",
        headers: getHeaders(token),
      });

      const data = await handleResponse(response);
      return data.user;
    } catch (error) {
      console.error("Token verification error:", error);
      throw error;
    }
  },

  // Récupération de l'utilisateur actuel
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  // Récupération du token
  getToken(): string | null {
    return localStorage.getItem("auth_token");
  },

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    return !!localStorage.getItem("auth_token");
  },

  // Mot de passe oublié
  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email }),
      });

      return handleResponse(response);
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  },

  // Réinitialisation du mot de passe
  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ token, newPassword }),
      });

      return handleResponse(response);
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  },
};
