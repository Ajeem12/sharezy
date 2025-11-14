import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const getPaymentStatus = createAsyncThunk(
  "paymentStatus/getPaymentStatus",
  async (paymentId, thunkAPI) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${apiUrl}/get_order_status/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const paymentStatusSlice = createSlice({
  name: "paymentStatus",
  initialState: {
    loading: false,
    success: false,
    error: null,
    data: null,
  },
  reducers: {
    resetPaymentState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPaymentStatus.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.data = null;
      })
      .addCase(getPaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
      })
      .addCase(getPaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to get payment status";
        state.data = null;
      });
  },
});

export const { resetPaymentState } = paymentStatusSlice.actions;
export default paymentStatusSlice.reducer;
