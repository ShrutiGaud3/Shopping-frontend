import API from './api';
import type { Category } from '../types';

export const adaptBackendCategory = (item: any): Category => {
  return {
    id: item._id || item.id,
    _id: item._id || item.id,
    name: item.name,
    slug: item.slug || item.name.toLowerCase().replace(/\s+/g, '-'),
    image: item.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    itemCount: item.itemCount || 150,
    featured: item.featured ?? true,
    gender: item.gender || 'All',
    parent: item.parent || null,
    order: item.order ?? 0,
    showInMenu: item.showInMenu !== undefined ? item.showInMenu : true,
    type: item.type || 'category',
    children: item.children ? item.children.map(adaptBackendCategory) : []
  };
};

export const categoryService = {
  // Get active categories
  getCategories: async () => {
    const response = await API.get('/categories');
    if (response.data && response.data.data) {
      return {
        success: true,
        data: response.data.data.map(adaptBackendCategory)
      };
    }
    return { success: false, data: [] };
  },

  // Get hierarchical category tree for Mega Menu
  getCategoryTree: async (): Promise<{ success: boolean; data: Category[] }> => {
    try {
      const response = await API.get('/categories/tree');
      if (response.data && response.data.data) {
        return {
          success: true,
          data: response.data.data.map(adaptBackendCategory)
        };
      }
      return { success: false, data: [] };
    } catch (error) {
      console.warn('Could not fetch category tree:', error);
      return { success: false, data: [] };
    }
  },

  // Admin: Create category
  createCategory: async (categoryData: Partial<Category>) => {
    const response = await API.post('/categories', {
      name: categoryData.name,
      slug: categoryData.slug || categoryData.name?.toLowerCase().replace(/\s+/g, '-'),
      image: categoryData.image,
      description: categoryData.name
    });
    return {
      success: true,
      data: adaptBackendCategory(response.data.data)
    };
  },

  // Admin: Update category
  updateCategory: async (id: string, categoryData: Partial<Category>) => {
    const response = await API.put(`/categories/${id}`, categoryData);
    return {
      success: true,
      data: adaptBackendCategory(response.data.data)
    };
  },

  // Admin: Delete category
  deleteCategory: async (id: string) => {
    const response = await API.delete(`/categories/${id}`);
    return response.data;
  }
};
