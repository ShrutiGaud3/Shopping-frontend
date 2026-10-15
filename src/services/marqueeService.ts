import API from './api';
import type { MarqueeItem } from '../types';

export const marqueeService = {
  getMarquees: async (): Promise<{ success: boolean; data: MarqueeItem[] }> => {
    try {
      const response = await API.get('/marquee');
      return {
        success: true,
        data: response.data.data || []
      };
    } catch (error) {
      console.warn('Could not fetch marquee items from backend:', error);
      return {
        success: false,
        data: []
      };
    }
  }
};
