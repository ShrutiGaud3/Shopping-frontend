import API from './api';
import type { TrustBadgeItem } from '../types';

export const trustBadgeService = {
  getTrustBadges: async (): Promise<{ success: boolean; data: TrustBadgeItem[] }> => {
    try {
      const response = await API.get('/trust-badges');
      return {
        success: true,
        data: response.data.data || []
      };
    } catch (error) {
      console.warn('Could not fetch trust badges from backend:', error);
      return {
        success: false,
        data: []
      };
    }
  }
};
