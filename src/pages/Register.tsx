import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    newsletter: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Ce champ est requis";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Ce champ est requis";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Ce champ est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }

    if (!formData.password) {
      newErrors.password = "Ce champ est requis";
    } else if (formData.password.length < 8) {
      newErrors.password = "Minimum 8 caractères";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Vous devez accepter les conditions";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simuler appel API
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log("Inscription réussie:", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email
      });

      setRegistrationSuccess(true);

    } catch (error) {
      console.error("Erreur d'inscription:", error);
      setErrors({
        submit: "Une erreur est survenue. Veuillez réessayer."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar cartItemsCount={0} onCartClick={() => { }} />

      {/* Hero Register */}
      <section
        className="relative min-h-[90vh] flex items-center justify-center text-white py-12"
        style={{
          backgroundImage: "url('/hero-section-register.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Message de succès */}
        {registrationSuccess ? (
          <div className="relative z-10 w-full max-w-md px-8 text-center">
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
              <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
                Bienvenue
              </h1>
              <p className="text-sm tracking-widest uppercase text-white/70 mb-6">
                Votre compte a été créé avec succès
              </p>
              <p className="text-white/80 mb-8">
                Un email de confirmation vous a été envoyé.
              </p>
            </div>
            <div className="space-y-4">
              <Link
                to="/login"
                className="block border border-white py-4 rounded-full text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300"
              >
                Se connecter
              </Link>
              <Link
                to="/"
                className="block border border-white/30 py-4 rounded-full text-sm tracking-widest uppercase hover:border-white hover:text-white transition-all duration-300"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        ) : (
          /* Formulaire d'inscription */
          <div className="relative z-10 w-full max-w-md px-8">
            <div className="mb-10 text-center">
              <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
                Inscription
              </h1>
              <p className="text-sm tracking-widest uppercase text-white/70">
                Créez votre compte
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Nom et Prénom */}
              <div className="grid grid-cols-2 gap-6">
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
                    className={`w-full bg-transparent border-b py-3 text-white placeholder-white/40 focus:outline-none transition-colors ${errors.firstName ? "border-red-500" : "border-white/40 focus:border-white"
                      }`}
                    placeholder="Jean"
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
                    className={`w-full bg-transparent border-b py-3 text-white placeholder-white/40 focus:outline-none transition-colors ${errors.lastName ? "border-red-500" : "border-white/40 focus:border-white"
                      }`}
                    placeholder="Dupont"
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
                  className={`w-full bg-transparent border-b py-3 text-white placeholder-white/40 focus:outline-none transition-colors ${errors.email ? "border-red-500" : "border-white/40 focus:border-white"
                    }`}
                  placeholder="exemple@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-xs tracking-widest uppercase mb-2 text-white/80">
                  Mot de passe
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`w-full bg-transparent border-b py-3 text-white placeholder-white/40 focus:outline-none transition-colors ${errors.password ? "border-red-500" : "border-white/40 focus:border-white"
                    }`}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-400">{errors.password}</p>
                )}
                <p className="mt-1 text-xs text-white/40">
                  Minimum 8 caractères
                </p>
              </div>

              {/* Checkboxes */}
              <div className="space-y-4">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="mt-1 mr-3 bg-transparent border-white/40 rounded focus:ring-0 focus:ring-offset-0"
                  />
                  <label
                    htmlFor="acceptTerms"
                    className="text-sm text-white/80"
                  >
                    J'accepte les{" "}
                    <a
                      href="/terms"
                      className="underline hover:text-white transition"
                    >
                      conditions d'utilisation
                    </a>{" "}
                    et la{" "}
                    <a
                      href="/privacy"
                      className="underline hover:text-white transition"
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
                  />
                  <label
                    htmlFor="newsletter"
                    className="text-sm text-white/80"
                  >
                    Je souhaite m'abonner à la newsletter pour recevoir des offres exclusives
                  </label>
                </div>
              </div>

              {/* Erreur générale */}
              {errors.submit && (
                <div className="p-4 border border-red-400/30 bg-red-400/10 rounded">
                  <p className="text-sm text-red-400">{errors.submit}</p>
                </div>
              )}

              {/* Bouton de soumission */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full  border border-white py-4 rounded-full text-sm tracking-widest uppercase transition-all duration-300 ${isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-white hover:text-black"
                  }`}
              >
                {isSubmitting ? (
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
                  "Créer mon compte"
                )}
              </button>

              {/* Lien vers la connexion */}
              <div className="text-center">
                <p className="text-xs tracking-widest uppercase text-white/60">
                  Déjà membre ?{" "}
                  <Link
                    to="/login"
                    className="hover:text-white transition"
                  >
                    Connectez-vous
                  </Link>
                </p>
              </div>
            </form>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Register;