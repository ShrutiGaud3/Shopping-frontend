import API from './api';
import type { User } from '../types';

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
}

export const authService = {
  // Register customer
  register: async (name: string, email: string, phone: string, password: string): Promise<AuthResponse> => {
    const response = await API.post('/auth/register', { name, email, phone, password });
    return response.data;
  },

  // Login customer / admin
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await API.post('/auth/login', { email, password });
    return response.data;
  },

  // Get current user profile (GET /api/auth/me)
  getMe: async (): Promise<{ success: boolean; user: User }> => {
    const response = await API.get('/auth/me');
    return response.data;
  }
};
