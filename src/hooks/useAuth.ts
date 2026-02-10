import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { LoginFormData, RegisterFormData, User } from "../types/auth";
import { authService } from "../services/authService";
import { validateLoginForm, validateRegisterForm } from "../utils/validation";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(() =>
    authService.getCurrentUser(),
  );
  const navigate = useNavigate();

  const login = useCallback(
    async (formData: LoginFormData) => {
      setIsLoading(true);
      setError(null);

      // Validation côté client
      const validationErrors = validateLoginForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        setError(
          validationErrors.email ||
            validationErrors.password ||
            "Validation error",
        );
        setIsLoading(false);
        return { success: false, errors: validationErrors };
      }

      try {
        const response = await authService.login(formData);
        setUser(response.user);

        // Redirection après connexion réussie
        navigate("/profile");

        return { success: true, data: response };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur de connexion";
        setError(errorMessage);
        return { success: false, errors: { submit: errorMessage } };
      } finally {
        setIsLoading(false);
      }
    },
    [navigate],
  );

  const register = useCallback(async (formData: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    // Validation côté client
    const validationErrors = validateRegisterForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setIsLoading(false);
      return { success: false, errors: validationErrors };
    }

    try {
      const response = await authService.register(formData);
      setUser(response.user);

      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur d'inscription";
      setError(errorMessage);
      return { success: false, errors: { submit: errorMessage } };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    navigate("/login");
  }, [navigate]);

  const forgotPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.forgotPassword(email);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors de la demande";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPassword = useCallback(
    async (token: string, newPassword: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authService.resetPassword(token, newPassword);
        return { success: true, data: response };
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de la réinitialisation";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    clearError,
    isAuthenticated: !!user,
  };
};
