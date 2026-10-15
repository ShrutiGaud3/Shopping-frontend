import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '../../services/productService';
import type { GetProductsParams } from '../../services/productService';
import type { Product } from '../../types';

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  loading: true,
  error: null
};

export const fetchProductsThunk = createAsyncThunk(
  'products/fetchProducts',
  async (params: GetProductsParams | undefined, { rejectWithValue }) => {
    try {
      const res = await productService.getProducts(params);
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
      return [];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductByIdThunk = createAsyncThunk(
  'products/fetchProductById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await productService.getProductById(id);
      if (res.success && res.data) {
        return res.data;
      }
      return rejectWithValue('Product not found');
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch product details');
    }
  }
);

export const createProductThunk = createAsyncThunk(
  'products/createProduct',
  async (productData: Partial<Product>, { rejectWithValue }) => {
    try {
      const res = await productService.createProduct(productData);
      if (res.success && res.data) {
        return res.data;
      }
      return rejectWithValue('Failed to create product');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Product creation error');
    }
  }
);

export const updateProductThunk = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }: { id: string; data: Partial<Product> }, { rejectWithValue }) => {
    try {
      const res = await productService.updateProduct(id, data);
      if (res.success && res.data) {
        return res.data;
      }
      return rejectWithValue('Failed to update product');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Product update error');
    }
  }
);

export const deleteProductThunk = createAsyncThunk(
  'products/deleteProduct',
  async (id: string, { rejectWithValue }) => {
    try {
      await productService.deleteProduct(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Product delete error');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    addProductDirect: (state, action) => {
      state.products.unshift(action.payload);
    },
    updateProductDirect: (state, action) => {
      const { id, data } = action.payload;
      const index = state.products.findIndex((p: any) => p.id === id || p._id === id);
      if (index > -1) {
        state.products[index] = { ...state.products[index], ...data };
      }
    },
    deleteProductDirect: (state, action) => {
      state.products = state.products.filter((p: any) => p.id !== action.payload && p._id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProductsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsThunk.rejected, (state) => {
        state.loading = false;
      })
      // Fetch Single Product
      .addCase(fetchProductByIdThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductByIdThunk.rejected, (state) => {
        state.loading = false;
      })
      // Create Product
      .addCase(createProductThunk.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
      })
      // Update Product
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        const updated = action.payload as any;
        const argId = action.meta.arg.id;

        const index = state.products.findIndex(
          (p: any) =>
            p.id === updated.id ||
            p._id === updated._id ||
            p.id === updated._id ||
            p._id === updated.id ||
            p.id === argId ||
            p._id === argId
        );
        if (index > -1) {
          state.products[index] = { ...state.products[index], ...updated };
        }
      })
      // Delete Product
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        const targetId = action.payload;
        state.products = state.products.filter((p: any) => p.id !== targetId && p._id !== targetId);
      });
  }
});

export const { setCurrentProduct, addProductDirect, updateProductDirect, deleteProductDirect } = productSlice.actions;
export default productSlice.reducer;
