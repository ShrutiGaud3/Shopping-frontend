import API from './api';
import type { Product } from '../types';

export interface GetProductsParams {
  search?: string;
  category?: string;
  gender?: string;
  fabric?: string;
  occasion?: string;
  work?: string;
  size?: string;
  color?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  minDiscount?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

// Helper to convert MongoDB backend product format to frontend Product type
export const adaptBackendProduct = (item: any): Product => {
  const primaryImage =
    item.images && item.images.length > 0
      ? item.images[0]
      : item.image || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80';

  return {
    id: item._id || item.id,
    _id: item._id || item.id,
    name: item.name,
    brand: item.brand || 'Velora Studio',
    category: item.category || 'Sarees',
    gender: item.gender || 'Women',
    price: item.price,
    originalPrice: item.originalPrice || item.price,
    discountPercent:
      item.discountPercent ||
      (item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0),
    rating: item.rating || 4.8,
    reviewsCount: item.reviewsCount || 10,
    image: primaryImage,
    images: item.images && item.images.length > 0 ? item.images : [primaryImage],
    colors: item.colors || [{ name: 'Default', hex: '#111827' }],
    sizes: item.sizes || ['Free Size'],
    isTrending: Boolean(item.isTrending),
    isDeal: Boolean(item.isDeal),
    isNew: Boolean(item.isNewArrival || item.isNew),
    isFeatured: Boolean(item.isFeatured),
    description: item.description || '',
    specifications: item.specifications || { fabric: item.fabric || 'Pure Silk', care: item.washCare || 'Dry Clean Only' },
    stock: Math.max(0, item.stock !== undefined ? Number(item.stock) : 25),
    sku: item.sku || '',
    fabric: item.fabric || item.specifications?.fabric || 'Pure Silk',
    work: item.work || item.specifications?.pattern || 'Zari Weaving',
    occasion: item.occasion || item.specifications?.occasion || 'Festive & Wedding',
    washCare: item.washCare || item.specifications?.care || 'Dry Clean Only',
    setContents: item.setContents || '',
    sareeLength: item.sareeLength || '',
    lehengaFlare: item.lehengaFlare || '',
    dispatchTime: item.dispatchTime || 'Ready to Dispatch in 24 Hours',
    videoUrl: item.videoUrl || '',
    stitchOptions: item.stitchOptions && item.stitchOptions.length > 0 ? item.stitchOptions : [
      { type: 'Unstitched (Free)', price: 0, description: 'Standard fabric material provided' }
    ],
    deliveryInfo: item.deliveryInfo || {
      estimatedDays: 4,
      isCodAvailable: true,
      freeShipping: true
    }
  };
};

export const productService = {
  // Fetch products with query filters
  getProducts: async (params?: GetProductsParams) => {
    const response = await API.get('/products', { params });
    if (response.data && response.data.data) {
      const adapted = response.data.data.map(adaptBackendProduct);
      return {
        success: true,
        data: adapted,
        pagination: response.data.pagination
      };
    }
    return { success: false, data: [] };
  },

  // Fetch product by ID
  getProductById: async (id: string) => {
    const response = await API.get(`/products/${id}`);
    if (response.data && response.data.data) {
      return {
        success: true,
        data: adaptBackendProduct(response.data.data)
      };
    }
    return { success: false, data: null };
  },

  // Admin: Create product
  createProduct: async (productData: Partial<Product>) => {
    const payload = {
      name: productData.name,
      brand: productData.brand || 'Velora Studio',
      category: productData.category || 'Jackets',
      gender: productData.gender || 'Women',
      price: Number(productData.price),
      originalPrice: Number(productData.originalPrice || productData.price),
      discountPercent: Number(productData.discountPercent || 0),
      description: productData.description || 'Exclusive Velora product.',
      images: productData.images && productData.images.length > 0 ? productData.images : [productData.image],
      sizes: productData.sizes || ['S', 'M', 'L'],
      colors: productData.colors || [{ name: 'Default', hex: '#111827' }],
      stock: 25,
      isFeatured: true,
      isTrending: productData.isTrending || false,
      isDeal: productData.isDeal || false
    };

    const response = await API.post('/products', payload);
    return {
      success: true,
      data: adaptBackendProduct(response.data.data)
    };
  },

  // Admin: Update product
  updateProduct: async (id: string, updatedData: Partial<Product>) => {
    const response = await API.put(`/products/${id}`, updatedData);
    return {
      success: true,
      data: adaptBackendProduct(response.data.data)
    };
  },

  // Admin: Delete product
  deleteProduct: async (id: string) => {
    const response = await API.delete(`/products/${id}`);
    return response.data;
  }
};
