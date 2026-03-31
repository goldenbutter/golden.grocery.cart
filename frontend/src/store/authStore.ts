import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

// Rehydrate auth state from localStorage on page load
// This keeps the user logged in across browser refreshes
const stored = localStorage.getItem('user');

export const useAuthStore = create<AuthState>((set) => ({
  user: stored ? JSON.parse(stored) : null,

  // Called after successful login or register — persists user + token to localStorage
  // The token stored here is picked up by api/index.ts for all authenticated requests
  setUser: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', user.token);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    set({ user });
  },

  // Clears user session from both memory and localStorage
  // Called by Navbar logout button and can be called on 401 responses if needed
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null });
  },
}));
