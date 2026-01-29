import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation simple
    if (!email.trim()) {
      setError("Veuillez entrer votre adresse email");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Veuillez entrer une adresse email valide");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simuler appel API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // En production, vous feriez un appel API ici
      // await fetch('/api/auth/forgot-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });

      console.log("Email de réinitialisation envoyé à:", email);
      setIsSuccess(true);

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

        {/* Contenu principal */}
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
                  Email envoyé
                </h1>
                <p className="text-sm tracking-widest uppercase text-white/70 mb-6">
                  Vérifiez votre boîte mail
                </p>
                <p className="text-white/80 mb-6">
                  Nous avons envoyé un lien de réinitialisation à <br />
                  <span className="font-medium">{email}</span>
                </p>
                <p className="text-sm text-white/60">
                  Le lien expirera dans 1 heure.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    setEmail("");
                    setIsSuccess(false);
                  }}
                  className="w-full border border-white py-4 rounded-full text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300"
                >
                  Réessayer avec un autre email
                </button>
                <Link
                  to="/login"
                  className="block border border-white/30 py-4 rounded-full text-sm tracking-widest uppercase hover:border-white hover:text-white transition-all duration-300"
                >
                  Retour à la connexion
                </Link>
              </div>
            </div>
          ) : (
            /* Formulaire de réinitialisation */
            <>
              <div className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
                  Mot de passe oublié
                </h1>
                <p className="text-sm tracking-widest uppercase text-white/70">
                  Réinitialisez votre mot de passe
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Instructions */}
                <div className="text-center">
                  <p className="text-white/80 text-sm">
                    Entrez votre adresse email. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
                  </p>
                </div>

                {/* Champ Email */}
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-2 text-white/80">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    required
                    className={`w-full bg-transparent border-b py-3 text-white placeholder-white/40 focus:outline-none transition-colors ${error && !email ? "border-red-500" : "border-white/40 focus:border-white"
                      }`}
                    placeholder="exemple@email.com"
                    autoFocus
                  />
                  {error && (
                    <p className="mt-2 text-xs text-red-400">{error}</p>
                  )}
                </div>

                {/* Bouton de soumission */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full mt-10 border border-white py-4 rounded-full text-sm tracking-widest uppercase transition-all duration-300 ${isSubmitting
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
                      Envoi en cours...
                    </span>
                  ) : (
                    "Envoyer le lien de réinitialisation"
                  )}
                </button>

                {/* Liens */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs tracking-widest uppercase text-white/60 pt-6 border-t border-white/10">
                  <Link
                    to="/login"
                    className="hover:text-white transition text-center sm:text-left"
                  >
                    ← Retour à la connexion
                  </Link>
                  <Link
                    to="/register"
                    className="hover:text-white transition text-center sm:text-right"
                  >
                    Créer un compte
                  </Link>
                </div>
              </form>
            </>
          )}

          {/* Informations supplémentaires */}
          {!isSuccess && (
            <div className="mt-12 text-center">
              <div className="inline-flex items-center justify-center space-x-4 text-xs text-white/40">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>Vos données sont sécurisées</span>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ForgotPassword;