import API from './api';
import type { BannerItem } from '../types';

export const bannerService = {
  getBanners: async (): Promise<{ success: boolean; data: BannerItem[] }> => {
    try {
      const response = await API.get('/banners');
      return {
        success: true,
        data: response.data.data || []
      };
    } catch (error) {
      console.warn('Could not fetch banners from backend:', error);
      return {
        success: false,
        data: []
      };
    }
  }
};
