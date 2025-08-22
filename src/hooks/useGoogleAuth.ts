import { useState, useEffect } from 'react';
import { GoogleAuthState, GoogleUser } from '../types/google-calendar';
import { googleAuthService } from '../services/google-auth';

export const useGoogleAuth = () => {
  const [authState, setAuthState] = useState<GoogleAuthState>({
    isSignedIn: false,
    user: null,
    accessToken: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await googleAuthService.initialize();
        setAuthState(googleAuthService.getAuthState());
      } catch (err) {
        console.error('Failed to initialize Google Auth:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize authentication');
      } finally {
        setIsLoading(false);
      }
    };

    const handleAuthStateChange = (state: GoogleAuthState) => {
      setAuthState(state);
      setError(null);
    };

    initializeAuth();
    googleAuthService.addAuthStateListener(handleAuthStateChange);

    return () => {
      googleAuthService.removeAuthStateListener(handleAuthStateChange);
    };
  }, []);

  const signIn = async (): Promise<GoogleUser | null> => {
    try {
      setError(null);
      setIsLoading(true);
      const user = await googleAuthService.signIn();
      return user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);
      await googleAuthService.signOut();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign out';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async (): Promise<string | null> => {
    try {
      const newToken = await googleAuthService.refreshToken();
      if (newToken) {
        setAuthState(prev => ({ ...prev, accessToken: newToken }));
      }
      return newToken;
    } catch (err) {
      console.error('Failed to refresh token:', err);
      return null;
    }
  };

  return {
    authState,
    isLoading,
    error,
    signIn,
    signOut,
    refreshToken,
    isAuthenticated: authState.isSignedIn,
    user: authState.user,
    accessToken: authState.accessToken
  };
};