import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../utils/Client";

export const fetchWalletList = createAsyncThunk(
  "wallet/fetchWalletList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/wallet_list");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch wallet list"
      );
    }
  }
);

const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    walletHistory: [],
    status: "idle",
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletList.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchWalletList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.walletHistory = action.payload;
      })
      .addCase(fetchWalletList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default walletSlice.reducer;
