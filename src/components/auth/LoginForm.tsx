import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { LoginFormData } from '../../types/auth';
import { useAuth } from '../../hooks/useAuth';
import { validateLoginForm } from '../../utils/validation';

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  redirectTo = '/profile'
}) => {
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Clear general error
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const validationErrors = validateLoginForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Attempt login
    const result = await login(formData);

    if (result.success) {
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Redirect if not handled by login hook
      if (redirectTo) {
        navigate(redirectTo);
      }
    } else if (result.errors) {
      setErrors(result.errors);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email */}
      <div>
        <label className="block text-xs tracking-widest uppercase mb-2 text-white/80">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className={`w-full bg-transparent border-b py-3 text-white placeholder-white/40 focus:outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-white/40 focus:border-white'
            }`}
          placeholder="exemple@email.com"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-400">{errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-xs tracking-widest uppercase text-white/80">
            Mot de passe
          </label>
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="text-xs tracking-widest uppercase text-white/60 hover:text-white transition-colors"
            disabled={isLoading}
          >
            {showPassword ? 'Masquer' : 'Afficher'}
          </button>
        </div>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className={`w-full bg-transparent border-b py-3 text-white placeholder-white/40 focus:outline-none transition-colors ${errors.password ? 'border-red-500' : 'border-white/40 focus:border-white'
              }`}
            placeholder="••••••••"
            disabled={isLoading}
          />
        </div>
        {errors.password && (
          <p className="mt-1 text-xs text-red-400">{errors.password}</p>
        )}
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="p-4 border border-red-400/30 bg-red-400/10 rounded">
          <p className="text-sm text-red-400 text-center">{errors.submit}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full border border-white py-4 rounded-full text-sm tracking-widest uppercase transition-all duration-300 ${isLoading
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-white hover:text-black'
          }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 mr-3 text-white"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Connexion...
          </span>
        ) : (
          'Se connecter'
        )}
      </button>

      {/* Links */}
      <div className="flex justify-between text-xs tracking-widest uppercase text-white/60 pt-4">
        <Link
          to="/forgot-password"
          className="hover:text-white transition-colors"
          onClick={clearError}
        >
          Mot de passe oublié
        </Link>
        <Link
          to="/register"
          className="hover:text-white transition-colors"
          onClick={clearError}
        >
          Créer un compte
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;