import API from './api';
import type { BlogPostItem } from '../types';

export interface GetBlogsResponse {
  success: boolean;
  data: BlogPostItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  tags: string[];
  categories: string[];
}

export interface GetBlogDetailResponse {
  success: boolean;
  data: BlogPostItem;
  relatedPosts: BlogPostItem[];
}

export const blogService = {
  // Get all published blog posts with filtering, search, and pagination
  getBlogs: async (params?: {
    tag?: string;
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<GetBlogsResponse> => {
    try {
      const query = new URLSearchParams();
      if (params?.tag) query.append('tag', params.tag);
      if (params?.category) query.append('category', params.category);
      if (params?.search) query.append('search', params.search);
      if (params?.page) query.append('page', params.page.toString());
      if (params?.limit) query.append('limit', params.limit.toString());

      const response = await API.get(`/blogs?${query.toString()}`);
      return response.data;
    } catch (err: any) {
      console.error('Failed to get blogs', err);
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 9, total: 0, pages: 0 },
        tags: [],
        categories: []
      };
    }
  },

  // Get single blog post by slug with related posts
  getBlogBySlug: async (slug: string): Promise<GetBlogDetailResponse> => {
    const response = await API.get(`/blogs/${slug}`);
    return response.data;
  }
};
