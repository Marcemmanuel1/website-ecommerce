import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { RegisterFormData } from '../../types/auth';
import { useAuth } from '../../hooks/useAuth';
import { validateRegisterForm } from '../../utils/validation';

interface RegisterFormProps {
  onSuccess?: () => void;
  onRegistered?: (userData: never) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onRegistered }) => {
  const { register, isLoading } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    newsletter: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    //  Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation côté client
    const validationErrors = validateRegisterForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Tentative d'inscription
    const result = await register(formData);

    if (result.success) {
      setRegistrationSuccess(true);

      // rappels de succès d'appel
      if (onSuccess) onSuccess();
      if (onRegistered && result.data) onRegistered(result.data.user);
    } else if (result.errors) {
      setErrors(result.errors);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // message de succes après inscription
  if (registrationSuccess) {
    return (
      <div className="text-center">
        <div className="mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-white mb-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-4">
            Bienvenue !
          </h2>
          <p className="text-sm tracking-widest uppercase text-white/70 mb-6">
            Votre compte a été créé avec succès
          </p>
          <p className="text-white/80 mb-8">
            Un email de confirmation vous a été envoyé.
          </p>
        </div>
        <div className="space-y-4">
          <Link
            to="/profile"
            className="block border border-white py-4 rounded-full text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300"
          >
            Accéder à mon profil
          </Link>
          <Link
            to="/"
            className="block border border-white/30 py-4 rounded-full text-sm tracking-widest uppercase hover:border-white hover:text-white transition-all duration-300"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  // Registration Form
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* nom et prenom */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-xs tracking-widest uppercase mb-2 text-white/80">
            Prénom
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className={`w-full bg-transparent border-b py-3 text-white placeholder-white/40 focus:outline-none transition-colors ${errors.firstName ? 'border-red-500' : 'border-white/40 focus:border-white'
              }`}
            placeholder="Jean"
            disabled={isLoading}
          />
          {errors.firstName && (
            <p className="mt-1 text-xs text-red-400">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase mb-2 text-white/80">
            Nom
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className={`w-full bg-transparent border-b py-3 text-white placeholder-white/40 focus:outline-none transition-colors ${errors.lastName ? 'border-red-500' : 'border-white/40 focus:border-white'
              }`}
            placeholder="Dupont"
            disabled={isLoading}
          />
          {errors.lastName && (
            <p className="mt-1 text-xs text-red-400">{errors.lastName}</p>
          )}
        </div>
      </div>

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

      {/* mot de passe */}
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
        {errors.password && (
          <p className="mt-1 text-xs text-red-400">{errors.password}</p>
        )}
        <p className="mt-1 text-xs text-white/40">
          Minimum 8 caractères
        </p>
      </div>

      {/* Confirmer le mot de passe */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-xs tracking-widest uppercase text-white/80">
            Confirmer le mot de passe
          </label>
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="text-xs tracking-widest uppercase text-white/60 hover:text-white transition-colors"
            disabled={isLoading}
          >
            {showConfirmPassword ? 'Masquer' : 'Afficher'}
          </button>
        </div>
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className={`w-full bg-transparent border-b py-3 text-white placeholder-white/40 focus:outline-none transition-colors ${errors.confirmPassword ? 'border-red-500' : 'border-white/40 focus:border-white'
            }`}
          placeholder="••••••••"
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Checkboxes */}
      <div className="space-y-4 pt-2">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="acceptTerms"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
            className="mt-1 mr-3 bg-transparent border-white/40 rounded focus:ring-0 focus:ring-offset-0"
            disabled={isLoading}
          />
          <label htmlFor="acceptTerms" className="text-sm text-white/80">
            J'accepte les{' '}
            <a
              href="/terms"
              className="underline hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              conditions d'utilisation
            </a>{' '}
            et la{' '}
            <a
              href="/privacy"
              className="underline hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              politique de confidentialité
            </a>
            {errors.acceptTerms && (
              <span className="block text-xs text-red-400 mt-1">
                {errors.acceptTerms}
              </span>
            )}
          </label>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            id="newsletter"
            name="newsletter"
            checked={formData.newsletter}
            onChange={handleChange}
            className="mt-1 mr-3 bg-transparent border-white/40 rounded focus:ring-0 focus:ring-offset-0"
            disabled={isLoading}
          />
          <label htmlFor="newsletter" className="text-sm text-white/80">
            Je souhaite m'abonner à la newsletter pour recevoir des offres exclusives
          </label>
        </div>
      </div>

      {/* en cas d'erreur de soumission */}
      {errors.submit && (
        <div className="p-4 border border-red-400/30 bg-red-400/10 rounded">
          <p className="text-sm text-red-400 text-center">{errors.submit}</p>
        </div>
      )}

      {/* bouton de soumission */}
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
            Création en cours...
          </span>
        ) : (
          'Créer mon compte'
        )}
      </button>

      {/* redirection vers la page login */}
      <div className="text-center pt-4">
        <p className="text-xs tracking-widest uppercase text-white/60">
          Déjà membre ?{' '}
          <Link
            to="/login"
            className="hover:text-white transition-colors"
          >
            Connectez-vous
          </Link>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;