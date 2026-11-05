import { getApiBase } from '../../utils/apiBase.js';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = getApiBase();

function authHeaders(getState) {
  const { auth } = getState();
  const token = auth.token || localStorage.getItem('edrilla_token');
  return {
    Authorization: `Bearer ${token}`,
    'x-access-token': token,
  };
}

export const createSupportTicket = createAsyncThunk(
  'support/createTicket',
  async (formData, { rejectWithValue, getState }) => {
    try {
      const response = await fetch(`${BASE_URL}/support-tickets/`, {
        method: 'POST',
        headers: authHeaders(getState),
        body: formData,
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
      const response = await fetch(`${BASE_URL}/support-tickets/my-tickets`, {
        method: 'GET',
        headers: authHeaders(getState),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to load tickets');
      }
      return data?.data?.tickets ?? [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load tickets');
    }
  }
);

export const fetchTicketById = createAsyncThunk(
  'support/fetchTicketById',
  async (ticketId, { rejectWithValue, getState }) => {
    try {
      const response = await fetch(`${BASE_URL}/support-tickets/${ticketId}`, {
        method: 'GET',
        headers: authHeaders(getState),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to load ticket');
      }
      return data?.data?.ticket ?? null;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load ticket');
    }
  }
);

export const addTicketMessage = createAsyncThunk(
  'support/addTicketMessage',
  async ({ ticketId, message }, { rejectWithValue, getState }) => {
    try {
      const body = new FormData();
      body.append('message', message);

      const response = await fetch(`${BASE_URL}/support-tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: authHeaders(getState),
        body,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reply');
      }
      return data?.data?.ticket ?? null;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to send reply');
    }
  }
);

const supportSlice = createSlice({
  name: 'support',
  initialState: {
    tickets: [],
    selectedTicket: null,
    loading: false,
    detailLoading: false,
    replySending: false,
    submitting: false,
    error: null,
    success: false,
  },
  reducers: {
    resetSupportState: (state) => {
      state.success = false;
      state.error = null;
    },
    clearSelectedTicket: (state) => {
      state.selectedTicket = null;
    },
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
        state.error = null;
      })
      .addCase(fetchMyTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchMyTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.tickets = [];
      })
      .addCase(fetchTicketById.pending, (state) => {
        state.detailLoading = true;
      })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedTicket = action.payload;
      })
      .addCase(fetchTicketById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })
      .addCase(addTicketMessage.pending, (state) => {
        state.replySending = true;
      })
      .addCase(addTicketMessage.fulfilled, (state, action) => {
        state.replySending = false;
        if (action.payload) {
          state.selectedTicket = action.payload;
        }
      })
      .addCase(addTicketMessage.rejected, (state, action) => {
        state.replySending = false;
        state.error = action.payload;
      });
  },
});

export const { resetSupportState, clearSelectedTicket } = supportSlice.actions;
export default supportSlice.reducer;
