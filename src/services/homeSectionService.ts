import API from './api';
import type { HomeSectionItem } from '../types';

export const homeSectionService = {
  getHomeSections: async (): Promise<{ success: boolean; data: HomeSectionItem[] }> => {
    try {
      const response = await API.get('/home-sections');
      return {
        success: true,
        data: response.data.data || []
      };
    } catch (error) {
      console.warn('Could not fetch home sections from backend:', error);
      return {
        success: false,
        data: []
      };
    }
  }
};
