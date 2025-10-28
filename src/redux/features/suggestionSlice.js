// // redux/slices/suggestionSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axiosClient from '../../utils/Client';

// const apiUrl = import.meta.env.VITE_API_URL;

// // Async thunk to fetch suggestion based on input and field
// export const fetchSuggestion = createAsyncThunk(
//   'suggestion/fetchSuggestion',
//   async ({ input, field }, { rejectWithValue }) => {
//     try {
//       const response = await axiosClient.post(`${apiUrl}/suggestion`, { city: input });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch suggestions');
//     }
//   }
// );

// const suggestionSlice = createSlice({
//   name: 'suggestion',
//   initialState: {
//     from: {
//       data: [],
//       status: 'idle',
//       error: null,
//     },
//     to: {
//       data: [],
//       status: 'idle',
//       error: null,
//     },
//   },
//   reducers: {
    
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchSuggestion.pending, (state, action) => {
//         const field = action.meta.arg.field;
//         state[field].status = 'loading';
//         state[field].error = null;
//       })
//       .addCase(fetchSuggestion.fulfilled, (state, action) => {
//         const field = action.meta.arg.field;
//         state[field].status = 'succeeded';
//         state[field].data = action.payload;
//       })
//       .addCase(fetchSuggestion.rejected, (state, action) => {
//         const field = action.meta.arg.field;
//         state[field].status = 'failed';
//         state[field].error = action.payload;
//       });
//   },
// });

// export default suggestionSlice.reducer;



import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../utils/Client';

const apiUrl = import.meta.env.VITE_API_URL;

export const fetchSuggestion = createAsyncThunk(
  'suggestion/fetchSuggestion',
  async ({ input, field }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(`${apiUrl}/suggestion`, { city: input });
      return { field, data: response.data };
    } catch (error) {
      return rejectWithValue({ field, error: error.response?.data?.message || 'Failed to fetch suggestions' });
    }
  }
);

const suggestionSlice = createSlice({
  name: 'suggestion',
  initialState: {
    from: {
      data: [],
      status: 'idle',
      error: null,
    },
    to: {
      data: [],
      status: 'idle',
      error: null,
    },
  },
  reducers: {
    clearSuggestions: (state, action) => {
      const field = action.payload;
      state[field] = {
        data: [],
        status: 'idle',
        error: null,
      };
    },
    resetSuggestions: (state) => {
      state.from = { data: [], status: 'idle', error: null };
      state.to = { data: [], status: 'idle', error: null };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuggestion.pending, (state, action) => {
        const field = action.meta.arg.field;
        state[field].status = 'loading';
        state[field].error = null;
      })
      .addCase(fetchSuggestion.fulfilled, (state, action) => {
        const { field, data } = action.payload;
        state[field].status = 'succeeded';
        state[field].data = data;
      })
      .addCase(fetchSuggestion.rejected, (state, action) => {
        const { field, error } = action.payload;
        state[field].status = 'failed';
        state[field].error = error;
      });
  },
});

export const { clearSuggestions, resetSuggestions } = suggestionSlice.actions;
export default suggestionSlice.reducer;