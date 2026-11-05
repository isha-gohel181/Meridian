import { getApiBase } from '../../utils/apiBase.js';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = getApiBase();

export const fetchSettings = createAsyncThunk(
  'config/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/settings`);
      if (!response.ok) throw new Error('Failed to fetch settings');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/** Public checkout list — optional courseId filters applicable coupons */
export const fetchAllCoupons = createAsyncThunk(
  'config/fetchAllCoupons',
  async (courseId, { rejectWithValue }) => {
    try {
      const qs = courseId ? `?courseId=${encodeURIComponent(courseId)}` : '';
      const response = await fetch(`${BASE_URL}/coupons/active${qs}`);
      if (!response.ok) throw new Error('Failed to fetch coupons');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const validateCoupon = createAsyncThunk(
  'config/validateCoupon',
  async ({ code, orderAmount, email, courseId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/checkout/validate-coupon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          couponCode: code,
          amount: orderAmount,
          email: email || undefined,
          courseId: courseId || undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to validate coupon');
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const configSlice = createSlice({
  name: 'config',
  initialState: {
    settings: null,
    coupons: [],
    couponData: null,
    couponLoading: false,
    couponError: null,
    settingsLoading: false,
    settingsError: null,
  },
  reducers: {
    clearCoupon: (state) => {
      state.couponData = null;
      state.couponError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.settingsLoading = true;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.settingsLoading = false;
        state.settings = action.payload?.settings || action.payload?.data || action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.settingsLoading = false;
        state.settingsError = action.payload;
      })
      .addCase(fetchAllCoupons.fulfilled, (state, action) => {
        const payload = action.payload;
        if (Array.isArray(payload)) {
          state.coupons = payload;
        } else if (payload?.data?.coupons && Array.isArray(payload.data.coupons)) {
          state.coupons = payload.data.coupons;
        } else if (payload?.data && Array.isArray(payload.data)) {
          state.coupons = payload.data;
        } else {
          state.coupons = [];
        }
      })
      .addCase(validateCoupon.pending, (state) => {
        state.couponLoading = true;
        state.couponError = null;
      })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.couponLoading = false;
        if (action.payload?.success) {
          const result = action.payload.data || {};
          const coupon = result.coupon || result;
          state.couponData = {
            ...coupon,
            appliedDiscount: result.discountAmount,
          };
        } else {
          state.couponError = action.payload?.message || 'Invalid coupon code';
          state.couponData = null;
        }
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.couponLoading = false;
        state.couponError = action.payload;
        state.couponData = null;
      });
  },
});

export const { clearCoupon } = configSlice.actions;
export default configSlice.reducer;
