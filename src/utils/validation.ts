import type {
  LoginFormData,
  RegisterFormData,
  ValidationErrors,
} from "../types/auth";

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return "Email requis";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Email invalide";
  }

  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return "Mot de passe requis";
  }

  if (password.length < 8) {
    return "Minimum 8 caractères";
  }

  return null;
};

export const validateName = (
  name: string,
  fieldName: string,
): string | null => {
  if (!name.trim()) {
    return `${fieldName} requis`;
  }

  if (name.length < 2) {
    return `${fieldName} trop court`;
  }

  return null;
};

export const validateLoginForm = (
  formData: LoginFormData,
): ValidationErrors => {
  const errors: ValidationErrors = {};

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;

  return errors;
};

export const validateRegisterForm = (
  formData: RegisterFormData,
): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Validation des noms
  const firstNameError = validateName(formData.firstName, "Prénom");
  if (firstNameError) errors.firstName = firstNameError;

  const lastNameError = validateName(formData.lastName, "Nom");
  if (lastNameError) errors.lastName = lastNameError;

  // Validation email
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  // Validation mot de passe
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;

  // Validation confirmation mot de passe
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Les mots de passe ne correspondent pas";
  }

  // Validation conditions
  if (!formData.acceptTerms) {
    errors.acceptTerms = "Vous devez accepter les conditions";
  }

  return errors;
};

export const validateForgotPasswordForm = (email: string): ValidationErrors => {
  const errors: ValidationErrors = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  return errors;
};

export const validateResetPasswordForm = (
  password: string,
  confirmPassword: string,
): ValidationErrors => {
  const errors: ValidationErrors = {};

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  if (password !== confirmPassword) {
    errors.confirmPassword = "Les mots de passe ne correspondent pas";
  }

  return errors;
};
