import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export const fetchUserWisePublishRides = createAsyncThunk(
  'userWisePublishRides/fetch',
  async (publishUserId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('admintoken');
      const response = await axios.get(
        `${apiUrl}/user_wise_publish_rides/${publishUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

const userWisePublishRidesSlice = createSlice({
  name: 'userWisePublishRides',
  initialState: {
    publishedRides: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserWisePublishRides.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserWisePublishRides.fulfilled, (state, action) => {
        state.loading = false;
        state.publishedRides = action.payload;
      })
      .addCase(fetchUserWisePublishRides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch published rides';
      });
  },
});

export default userWisePublishRidesSlice.reducer;
