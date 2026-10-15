import API from './api';
import type { Setting } from '../types';

export const settingService = {
  getSettings: async (): Promise<{ success: boolean; data: Setting | null }> => {
    try {
      const response = await API.get('/settings');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.warn('Could not fetch settings from backend, using fallbacks:', error);
      return {
        success: false,
        data: null
      };
    }
  }
};
