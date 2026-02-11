import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isValidToken, setIsValidToken] = useState(true);

  // Vérifier la validité du token (simulé)
  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
      setError("Lien de réinitialisation invalide ou expiré");
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.password) {
      return "Veuillez entrer un mot de passe";
    }

    if (formData.password.length < 8) {
      return "Le mot de passe doit contenir au moins 8 caractères";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Les mots de passe ne correspondent pas";
    }

    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidToken) {
      setError("Lien de réinitialisation invalide");
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simuler appel API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // En production :
      // await fetch('/api/auth/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     token, 
      //     password: formData.password 
      //   })
      // });

      console.log("Mot de passe réinitialisé avec succès");
      setIsSuccess(true);

      // Redirection automatique après 3 secondes
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (err) {
      console.error("Erreur:", err);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar cartItemsCount={0} onCartClick={() => { }} />

      {/* Hero Section */}
      <section
        className="relative min-h-[90vh] flex items-center justify-center text-white py-12"
        style={{
          backgroundImage: "url('/hero-section-reset-un.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 w-full max-w-md px-8">

          {isSuccess ? (
            /* Message de succès */
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
                  Mot de passe réinitialisé
                </h1>
                <p className="text-sm tracking-widest uppercase text-white/70 mb-6">
                  Succès
                </p>
                <p className="text-white/80 mb-6">
                  Votre mot de passe a été modifié avec succès.
                </p>
                <p className="text-sm text-white/60">
                  Redirection vers la page de connexion...
                </p>
              </div>

              <Link
                to="/login"
                className="block border border-white py-4 rounded-full text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300"
              >
                Se connecter maintenant
              </Link>
            </div>
          ) : (
            /* Formulaire de réinitialisation */
            <>
              <div className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
                  Nouveau mot de passe
                </h1>
                <p className="text-sm tracking-widest uppercase text-white/70">
                  Choisissez un nouveau mot de passe
                </p>
              </div>

              {!isValidToken && (
                <div className="mb-6 p-4 border border-red-400/30 bg-red-400/10 rounded text-center">
                  <p className="text-red-400 text-sm">
                    Ce lien de réinitialisation est invalide ou a expiré.
                  </p>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-red-300 hover:text-red-200 transition mt-2 inline-block"
                  >
                    Demander un nouveau lien
                  </Link>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Champ Nouveau mot de passe */}
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-2 text-white/80">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={!isValidToken}
                    className={`w-full bg-transparent border-b py-3 text-white placeholder-white/40 focus:outline-none transition-colors ${error && !formData.password ? "border-red-500" : "border-white/40 focus:border-white"
                      } ${!isValidToken ? "opacity-50 cursor-not-allowed" : ""}`}
                    placeholder="••••••••"
                  />
                  <p className="mt-1 text-xs text-white/40">
                    Minimum 8 caractères
                  </p>
                </div>

                {/* Champ Confirmation */}
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-2 text-white/80">
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={!isValidToken}
                    className={`w-full bg-transparent border-b py-3 text-white placeholder-white/40 focus:outline-none transition-colors ${error && formData.password !== formData.confirmPassword ? "border-red-500" : "border-white/40 focus:border-white"
                      } ${!isValidToken ? "opacity-50 cursor-not-allowed" : ""}`}
                    placeholder="••••••••"
                  />
                </div>

                {/* Message d'erreur */}
                {error && (
                  <div className="p-4 border border-red-400/30 bg-red-400/10 rounded">
                    <p className="text-sm text-red-400 text-center">{error}</p>
                  </div>
                )}

                {/* Bouton de soumission */}
                <button
                  type="submit"
                  disabled={isSubmitting || !isValidToken}
                  className={`w-full mt-10 border border-white py-4 rounded-full text-sm tracking-widest uppercase transition-all duration-300 ${isSubmitting || !isValidToken
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
                      Réinitialisation en cours...
                    </span>
                  ) : (
                    "Réinitialiser le mot de passe"
                  )}
                </button>

                {/* Lien vers la connexion */}
                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-xs tracking-widest uppercase text-white/60 hover:text-white transition"
                  >
                    ← Retour à la connexion
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ResetPassword;