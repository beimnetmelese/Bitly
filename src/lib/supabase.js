// src/lib/supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mcpozbbuwowjabcpaxld.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jcG96YmJ1d293amFiY3BheGxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDU2MDcsImV4cCI6MjA2OTAyMTYwN30.0MESOr7M4VJM1pib0bFQp4MVBg98uIS6G1T9wgC2ces";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const authAPI = {
  // Sign up new user
  signUp: async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    });
    return { data, error };
  },

  // Sign in user
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // Sign out user
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Get current session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  }
};
