import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import { userService, type UpdateProfilePayload } from '../../services/userService';
import type { User } from '../../types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialToken = localStorage.getItem('velora_token') || null;
const initialUser = localStorage.getItem('velora_user') ? JSON.parse(localStorage.getItem('velora_user')!) : null;

const initialState: AuthState = {
  user: initialUser,
  token: initialToken,
  loading: false,
  error: null
};

export const registerThunk = createAsyncThunk(
  'auth/register',
  async ({ name, email, phone, password }: { name: string; email: string; phone: string; password: string }, { rejectWithValue }) => {
    try {
      const data = await authService.register(name, email, phone, password);
      if (data.success && data.token && data.user) {
        localStorage.setItem('velora_token', data.token);
        localStorage.setItem('velora_user', JSON.stringify(data.user));
        return data;
      }
      return rejectWithValue(data.message || 'Registration failed');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Registration failed');
    }
  }
);

export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const data = await authService.login(email, password);
      if (data.success && data.token && data.user) {
        localStorage.setItem('velora_token', data.token);
        localStorage.setItem('velora_user', JSON.stringify(data.user));
        return data;
      }
      return rejectWithValue(data.message || 'Login failed');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Login failed');
    }
  }
);

export const getMeThunk = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const data = await authService.getMe();
      if (data.success && data.user) {
        localStorage.setItem('velora_user', JSON.stringify(data.user));
        return data.user;
      }
      return rejectWithValue('Session invalid');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Session expired');
    }
  }
);

export const updateUserProfileThunk = createAsyncThunk(
  'auth/updateUserProfile',
  async (payload: UpdateProfilePayload, { rejectWithValue }) => {
    try {
      const data = await userService.updateUserProfile(payload);
      if (data.success && data.data) {
        localStorage.setItem('velora_user', JSON.stringify(data.data));
        return data;
      }
      return rejectWithValue(data.message || 'Profile update failed');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Profile update failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('velora_token');
      localStorage.removeItem('velora_user');
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // GetMe
      .addCase(getMeThunk.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      // Update Profile
      .addCase(updateUserProfileThunk.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.user = { ...state.user, ...action.payload.data };
        }
      });
  }
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
