import React from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import RegisterForm from '../components/auth/RegisterForm';

const Register: React.FC = () => {
  const handleRegistrationSuccess = () => {
    // Vous pouvez ajouter des actions supplémentaires après une inscription réussie
    console.log('Inscription réussie !');
  };

  const handleUserRegistered = (userData: never) => {
    // Vous pouvez traiter les données utilisateur ici
    console.log('Utilisateur inscrit:', userData);
  };

  return (
    <AuthLayout
      title="Inscription"
      subtitle="Créez votre compte"
      backgroundImage="/hero-section-register.jpg"
    >
      <RegisterForm
        onSuccess={handleRegistrationSuccess}
        onRegistered={handleUserRegistered}
      />
    </AuthLayout>
  );
};

export default Register;