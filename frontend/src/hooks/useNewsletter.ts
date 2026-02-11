import { useState, useCallback } from "react";

export const useNewsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  }, []);

  const subscribe = useCallback(
    async (email: string) => {
      if (!validateEmail(email)) {
        return { success: false, message: "Email invalide" };
      }

      setIsLoading(true);

      try {
        // Simulation d'appel API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setIsSubscribed(true);
        setEmail("");

        return { success: true, message: "Inscription réussie !" };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        return { success: false, message: "Erreur lors de l'inscription" };
      } finally {
        setIsLoading(false);
      }
    },
    [validateEmail],
  );

  const resetSubscription = useCallback(() => {
    setIsSubscribed(false);
    setEmail("");
  }, []);

  return {
    email,
    setEmail,
    isSubscribed,
    isLoading,
    subscribe,
    resetSubscription,
    validateEmail,
  };
};
