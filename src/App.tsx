import React from 'react';
import { Login } from './screens/Login';
import { MainApp } from './screens/MainApp/MainApp';
import { useAuth } from './hooks/useAuth';

export const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-[#607589]">Carregando...</div>
      </div>
    );
  }

  return isAuthenticated ? <MainApp /> : <Login />;
};