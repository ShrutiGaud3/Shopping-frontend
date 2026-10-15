import API from './api';
import type { FaqItem } from '../types';

export const faqService = {
  getFaqs: async (category?: string): Promise<{ success: boolean; data: FaqItem[] }> => {
    try {
      const url = category ? `/faqs?category=${encodeURIComponent(category)}` : '/faqs';
      const response = await API.get(url);
      return {
        success: true,
        data: response.data.data || []
      };
    } catch (error) {
      console.warn('Could not fetch FAQs from backend:', error);
      return {
        success: false,
        data: []
      };
    }
  }
};
