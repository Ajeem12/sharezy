import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("admintoken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const apiUrl = import.meta.env.VITE_API_URL;

//  POST - Approve KYC
export const approveKyc = createAsyncThunk(
  "kyc/approveKyc",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${apiUrl}/approve_status/${id}`,
        {},
        getAuthHeaders()
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Approval failed");
    }
  }
);

//  POST - Deny KYC
export const denyKyc = createAsyncThunk(
  "kyc/denyKyc",
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${apiUrl}/reject_status/${id}`,
        { reason },
        getAuthHeaders()
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Denial failed");
    }
  }
);

// Slice
const kycStatusSlice = createSlice({
  name: "kycStatus",
  initialState: {
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearKycMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(approveKyc.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(approveKyc.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "KYC approved successfully";
      })
      .addCase(approveKyc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(denyKyc.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(denyKyc.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "KYC denied successfully";
      })
      .addCase(denyKyc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearKycMessages } = kycStatusSlice.actions;

export default kycStatusSlice.reducer;
