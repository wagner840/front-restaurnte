import { GoogleAuthState, GoogleUser } from '../types/google-calendar';

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

class GoogleAuthService {
  private gapi: any;
  private tokenClient: any;
  private accessToken: string | null = null;
  private isInitialized = false;
  private listeners: ((state: GoogleAuthState) => void)[] = [];
  private currentUser: GoogleUser | null = null;

  private readonly CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  private readonly API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  private readonly DISCOVERY_DOC = import.meta.env.VITE_GOOGLE_DISCOVERY_DOC;
  private readonly SCOPES = import.meta.env.VITE_GOOGLE_SCOPES;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load Google APIs and Google Identity Services
      await Promise.all([
        this.loadGoogleAPIs(),
        this.loadGoogleIdentityServices()
      ]);
      
      await this.initializeGapi();
      this.initializeGoogleIdentity();

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Google Auth:', error);
      throw new Error('Failed to initialize Google Authentication');
    }
  }

  private async loadGoogleAPIs(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google APIs'));
      document.head.appendChild(script);
    });
  }

  private async loadGoogleIdentityServices(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
      document.head.appendChild(script);
    });
  }

  private async initializeGapi(): Promise<void> {
    this.gapi = window.gapi;
    
    await new Promise<void>((resolve) => {
      this.gapi.load('client', resolve);
    });

    await this.gapi.client.init({
      apiKey: this.API_KEY,
      discoveryDocs: [
        this.DISCOVERY_DOC,
        'https://www.googleapis.com/discovery/v1/apis/oauth2/v2/rest'
      ]
    });
  }

  private initializeGoogleIdentity(): void {
    this.tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: this.CLIENT_ID,
      scope: this.SCOPES,
      callback: '', // Will be set dynamically during signIn
    });
  }

  async signIn(): Promise<GoogleUser> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      try {
        // Set callback for this specific sign-in attempt
        this.tokenClient.callback = async (response: any) => {
          try {
            if (response.error) {
              console.error('OAuth error:', response);
              reject(new Error(`Google sign in failed: ${response.error}`));
              return;
            }

            this.accessToken = response.access_token;
            
            // Set the token immediately for gapi client
            if (window.gapi?.client) {
              window.gapi.client.setToken({
                access_token: this.accessToken
              });
            }

            const user = await this.fetchUserInfo();
            this.notifyListeners();
            resolve(user);
          } catch (error) {
            console.error('Error in OAuth callback:', error);
            reject(error);
          }
        };

        // Request access token
        this.tokenClient.requestAccessToken({ 
          prompt: 'consent',
          hint: 'Select an account'
        });
      } catch (error) {
        console.error('Sign in failed:', error);
        reject(new Error('Google sign in failed'));
      }
    });
  }

  async signOut(): Promise<void> {
    try {
      if (this.accessToken) {
        window.google.accounts.oauth2.revoke(this.accessToken);
      }
      this.accessToken = null;
      this.currentUser = null;
      this.notifyListeners();
    } catch (error) {
      console.error('Sign out failed:', error);
      throw new Error('Google sign out failed');
    }
  }

  getAuthState(): GoogleAuthState {
    return {
      isSignedIn: !!this.accessToken && !!this.currentUser,
      user: this.currentUser,
      accessToken: this.accessToken
    };
  }

  private async fetchUserInfo(): Promise<GoogleUser> {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    try {
      // Try using gapi client first (more reliable with proper auth)
      if (window.gapi?.client?.oauth2) {
        const response = await window.gapi.client.oauth2.userinfo.get();
        const userData = response.result;
        
        this.currentUser = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          picture: userData.picture
        };
        
        return this.currentUser;
      }

      // Fallback to direct fetch with proper headers
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo?access_token=' + this.accessToken);

      if (!response.ok) {
        console.error('User info fetch failed:', response.status, response.statusText);
        throw new Error(`Failed to fetch user info: ${response.status}`);
      }

      const userData = await response.json();
      this.currentUser = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        picture: userData.picture
      };

      return this.currentUser;
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      throw error;
    }
  }

  addAuthStateListener(listener: (state: GoogleAuthState) => void): void {
    this.listeners.push(listener);
  }

  removeAuthStateListener(listener: (state: GoogleAuthState) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  private notifyListeners(): void {
    const state = this.getAuthState();
    this.listeners.forEach(listener => listener(state));
  }

  async refreshToken(): Promise<string | null> {
    if (!this.accessToken) return null;

    try {
      // Request a new token silently
      this.tokenClient.requestAccessToken({ prompt: '' });
      
      return new Promise((resolve) => {
        const originalCallback = this.tokenClient.callback;
        this.tokenClient.callback = (response: any) => {
          if (response.error) {
            resolve(null);
            return;
          }
          
          this.accessToken = response.access_token;
          resolve(this.accessToken);
          
          // Restore original callback
          this.tokenClient.callback = originalCallback;
        };
      });
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  }

  isTokenExpired(): boolean {
    // For Google Identity Services, we'll implement a simple check
    // In practice, Google handles token expiration automatically
    return !this.accessToken;
  }
}

export const googleAuthService = new GoogleAuthService();