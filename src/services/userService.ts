import API from './api';
import type { User } from '../types';

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  password?: string;
  addresses?: User['addresses'];
}

export const userService = {
  // Get user profile
  getUserProfile: async () => {
    const response = await API.get('/users/profile');
    return response.data;
  },

  // Update user profile (name, phone, password, addresses)
  updateUserProfile: async (payload: UpdateProfilePayload) => {
    const response = await API.put('/users/profile', payload);
    return response.data;
  }
};
