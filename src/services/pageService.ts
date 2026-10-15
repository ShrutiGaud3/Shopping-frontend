import API from './api';
import type { PageItem } from '../types';

export const pageService = {
  getPages: async (): Promise<{ success: boolean; data: PageItem[] }> => {
    try {
      const response = await API.get('/pages');
      return {
        success: true,
        data: response.data.data || []
      };
    } catch (error) {
      console.warn('Could not fetch pages from backend:', error);
      return {
        success: false,
        data: []
      };
    }
  },

  getPageBySlug: async (slug: string): Promise<{ success: boolean; data: PageItem | null }> => {
    try {
      const response = await API.get(`/pages/${slug}`);
      return {
        success: true,
        data: response.data.data || null
      };
    } catch (error) {
      console.warn(`Could not fetch page for slug "${slug}":`, error);
      return {
        success: false,
        data: null
      };
    }
  }
};
