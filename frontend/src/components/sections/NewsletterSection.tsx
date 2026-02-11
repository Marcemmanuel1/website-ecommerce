import React from 'react';
import { useNewsletter } from '../../hooks';

export const NewsletterSection: React.FC = () => {
  const {
    email,
    setEmail,
    isSubscribed,
    isLoading,
    subscribe
  } = useNewsletter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await subscribe(email);
    if (result.success) {
      alert('Merci pour votre inscription à notre newsletter !');
    }
  };

  return (
    <section className="py-16 md:py-24 border-t border-b border-gray-200">
      <div className="container mx-auto px-4 md:px-8 max-w-2xl">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-4 md:mb-6 text-gray-900">
            L'Art de la Mode
          </h2>
          <p className="mb-6 md:mb-8 text-gray-600">
            Recevez en exclusivité nos éditions limitées et invitations aux événements privés.
          </p>

          {isSubscribed ? (
            <div className="py-6 md:py-8">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm tracking-widest uppercase text-gray-900">
                Merci pour votre inscription
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 border-b border-black px-4 py-3 text-center text-xs sm:text-sm tracking-widest uppercase focus:outline-none focus:border-gray-400 bg-transparent"
                required
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="border rounded-[50px] border-black px-6 sm:px-8 py-3 text-xs sm:text-sm tracking-widest uppercase text-black hover:bg-black hover:text-white transition-colors duration-300 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Inscription...' : "S'inscrire"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};