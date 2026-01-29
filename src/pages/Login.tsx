import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar cartItemsCount={0} onCartClick={() => { }} />

      {/* Hero Login */}
      <section
        className="relative h-[90vh] flex items-center justify-center text-white"
        style={{
          backgroundImage: "url('/hero-section-deux.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Form Container */}
        <div className="relative z-10 w-full max-w-md px-8">
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
              Connexion
            </h1>
            <p className="text-sm tracking-widest uppercase text-white/70">
              Accédez à votre espace
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* Email */}
            <div>
              <label className="block text-xs tracking-widest uppercase mb-2 text-white/80">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border-b border-white/40 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white transition-colors"
                placeholder="exemple@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs tracking-widest uppercase mb-2 text-white/80">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent border-b border-white/40 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white transition-colors"
                placeholder="••••••••"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full mt-10 border border-white py-4 rounded-full text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300"
            >
              Se connecter
            </button>

            {/* Links */}
            <div className="flex justify-between text-xs tracking-widest uppercase text-white/60 mt-6">
              <a href="/forgot-password" className="hover:text-white transition">
                Mot de passe oublié
              </a>
              <a href="/register" className="hover:text-white transition">
                Créer un compte
              </a>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Login;
