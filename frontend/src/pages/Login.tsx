import React from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import LoginForm from '../components/auth/LoginForm';

const Login: React.FC = () => {
  const handleLoginSuccess = () => {
    // Vous pouvez ajouter des actions supplémentaires après une connexion réussie
    console.log('Connexion réussie !');
  };

  return (
    <AuthLayout
      title="Connexion"
      subtitle="Accédez à votre espace"
      backgroundImage="/hero-section-register.jpg"
    >
      <LoginForm
        onSuccess={handleLoginSuccess}
        redirectTo="/profile"
      />
    </AuthLayout>
  );
};

export default Login;