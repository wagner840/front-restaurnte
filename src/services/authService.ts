import { supabase } from "../lib/supabaseClient";
import { SignInWithPasswordCredentials } from "@supabase/supabase-js";

export const authService = {
  async signIn(credentials: SignInWithPasswordCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) {
      console.error("Error signing in:", error);
      throw error;
    }
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  },

  async getSession() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) {
      console.error("Error getting session:", error);
      throw error;
    }
    return session;
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(callback);
    return subscription;
  },
};
