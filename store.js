import { create } from 'zustand';
import { authAPI } from '../services/api';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  
  login: async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { access_token, user } = response.data;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ 
        user, 
        token: access_token, 
        isAuthenticated: true 
      });
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Erreur de connexion' 
      };
    }
  },
  
  register: async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { access_token, user } = response.data;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ 
        user, 
        token: access_token, 
        isAuthenticated: true 
      });
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Erreur d\'inscription' 
      };
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },
  
  refreshUser: async () => {
    try {
      const response = await authAPI.getMe();
      const user = response.data;
      
      localStorage.setItem('user', JSON.stringify(user));
      set({ user });
      
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },
}));

export const useDocumentStore = create((set) => ({
  documents: [],
  currentDocument: null,
  loading: false,
  
  setDocuments: (documents) => set({ documents }),
  setCurrentDocument: (document) => set({ currentDocument: document }),
  setLoading: (loading) => set({ loading }),
}));
