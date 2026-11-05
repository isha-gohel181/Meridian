import { getApiBase } from '../../utils/apiBase.js';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = getApiBase();

export const createSupportTicket = createAsyncThunk(
  'support/createTicket',
  async (formData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token || localStorage.getItem('edrilla_token');
      
      const response = await fetch(`${BASE_URL}/support-tickets/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-access-token': token
        },
        body: formData
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create ticket');
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/** Public contact form → stored in admin Student Queries */
export const submitContactQuery = createAsyncThunk(
  'support/submitContactQuery',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/queries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit your message');
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to submit your message');
    }
  }
);

export const fetchMyTickets = createAsyncThunk(
  'support/fetchMyTickets',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token || localStorage.getItem('edrilla_token');
      
      const response = await fetch(`${BASE_URL}/support-tickets/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-access-token': token
        }
      });
      
      const data = await response.json();
      if (!response.ok) {
        // If endpoint error occurs, return empty list safely
        return { data: [] };
      }
      return data;
    } catch (error) {
      return { data: [] };
    }
  }
);

const supportSlice = createSlice({
  name: 'support',
  initialState: {
    tickets: [],
    loading: false,
    submitting: false,
    error: null,
    success: false
  },
  reducers: {
    resetSupportState: (state) => {
      state.success = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSupportTicket.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createSupportTicket.fulfilled, (state) => {
        state.submitting = false;
        state.success = true;
      })
      .addCase(createSupportTicket.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })
      .addCase(submitContactQuery.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitContactQuery.fulfilled, (state) => {
        state.submitting = false;
        state.success = true;
      })
      .addCase(submitContactQuery.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })
      .addCase(fetchMyTickets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload?.data || [];
      })
      .addCase(fetchMyTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSupportState } = supportSlice.actions;
export default supportSlice.reducer;
