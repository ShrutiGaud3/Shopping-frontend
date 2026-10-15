import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { categoryService } from '../../services/categoryService';
import type { Category } from '../../types';

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null
};

export const fetchCategoriesThunk = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const res = await categoryService.getCategories();
      if (res.success && res.data && res.data.length > 0) {
        return res.data;
      }
      return rejectWithValue('No categories found');
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch categories');
    }
  }
);

export const createCategoryThunk = createAsyncThunk(
  'categories/createCategory',
  async (categoryData: Partial<Category>, { rejectWithValue }) => {
    try {
      const res = await categoryService.createCategory(categoryData);
      if (res.success && res.data) {
        return res.data;
      }
      return rejectWithValue('Failed to create category');
    } catch (err: any) {
      return rejectWithValue(err.message || 'Category creation error');
    }
  }
);

export const updateCategoryThunk = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, data }: { id: string; data: Partial<Category> }, { rejectWithValue }) => {
    try {
      const res = await categoryService.updateCategory(id, data);
      if (res.success && res.data) {
        return res.data;
      }
      return rejectWithValue('Failed to update category');
    } catch (err: any) {
      return rejectWithValue(err.message || 'Category update error');
    }
  }
);

export const deleteCategoryThunk = createAsyncThunk(
  'categories/deleteCategory',
  async (id: string, { rejectWithValue }) => {
    try {
      await categoryService.deleteCategory(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Category delete error');
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategoriesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategoriesThunk.rejected, (state) => {
        state.loading = false;
      })
      // Create Category
      .addCase(createCategoryThunk.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      // Update Category
      .addCase(updateCategoryThunk.fulfilled, (state, action) => {
        const index = state.categories.findIndex((c) => c.id === action.payload.id);
        if (index > -1) {
          state.categories[index] = action.payload;
        }
      })
      // Delete Category
      .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
        state.categories = state.categories.filter((c) => c.id !== action.payload);
      });
  }
});

export default categorySlice.reducer;
