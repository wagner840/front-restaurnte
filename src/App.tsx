import React from 'react';
import { Login } from './screens/Login';
import { MainApp } from './screens/MainApp/MainApp';
import { useAuth } from './hooks/useAuth';
import { Skeleton } from './components/ui/skeleton';

export const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="mb-4">
            <Skeleton className="h-12 w-48 mx-auto mb-2" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
          <div 
            className="text-sm text-gray-500"
            role="status"
            aria-live="polite"
          >
            Carregando RestaurantePro...
          </div>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <MainApp /> : <Login />;
};