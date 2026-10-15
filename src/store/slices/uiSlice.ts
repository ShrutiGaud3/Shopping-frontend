import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { FilterState } from '../../types';

const initialFilters: FilterState = {
  searchQuery: '',
  categories: [],
  genders: [],
  brands: [],
  sizes: [],
  colors: [],
  priceRange: [0, 10000],
  minDiscount: 0,
  sortBy: 'recommended'
};

interface UIState {
  searchQuery: string;
  filterState: FilterState;
  toastMessage: string | null;
}

const initialState: UIState = {
  searchQuery: '',
  filterState: initialFilters,
  toastMessage: null
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilterState: (state, action: PayloadAction<FilterState>) => {
      state.filterState = action.payload;
    },
    resetFilters: (state) => {
      state.filterState = initialFilters;
    },
    showToast: (state, action: PayloadAction<string>) => {
      state.toastMessage = action.payload;
    },
    clearToast: (state) => {
      state.toastMessage = null;
    }
  }
});

export const { setSearchQuery, setFilterState, resetFilters, showToast, clearToast } = uiSlice.actions;
export default uiSlice.reducer;
