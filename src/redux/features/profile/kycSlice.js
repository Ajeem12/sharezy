import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../utils/Client";

const apiUrl = import.meta.env.VITE_API_URL;

// 🔄 POST KYC (New Submission)
export const submitKyc = createAsyncThunk(
  "kyc/submitKyc",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(`${apiUrl}/ekyc`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Submission failed"
      );
    }
  }
);

// 🔁 GET KYC STATUS (Fetch Existing KYC)
export const fetchKyc = createAsyncThunk(
  "kyc/fetchKyc",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`${apiUrl}/ekyc`);
      return response.data.data; // assuming the actual KYC object is in `data.data`
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Fetch failed"
      );
    }
  }
);

// ✏️ PUT (Update KYC)
export const updateKyc = createAsyncThunk(
  "kyc/updateKyc",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      

      const response = await axiosClient.post(`${apiUrl}/ekyc/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Update failed"
      );
    }
  }
);


// 🧩 Slice
const kycSlice = createSlice({
  name: "kyc",
  initialState: {
    data: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetKycState: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ POST
      .addCase(submitKyc.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitKyc.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
      })
      .addCase(submitKyc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔄 GET
      .addCase(fetchKyc.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKyc.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchKyc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✏️ PUT
      .addCase(updateKyc.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateKyc.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
      })
      .addCase(updateKyc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetKycState } = kycSlice.actions;
export default kycSlice.reducer;
