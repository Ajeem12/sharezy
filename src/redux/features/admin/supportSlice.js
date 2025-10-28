import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  rideDisputes: [],
  status: "idle",
  error: null,
};
const apiUrl = import.meta.env.VITE_API_URL;

export const fetchRideDisputes = createAsyncThunk(
  "rideDisputes/fetchRideDisputes",
  async (id, { rejectWithValue }) => {
    const token = localStorage.getItem("admintoken");
    if (!token) {
      return rejectWithValue("No auth token");
    }
    try {
      const response = await axios.get(`${apiUrl}/block_report_remark/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch ride disputes"
      );
    }
  }
);

export const fetchAllRideDisputes = createAsyncThunk(
  "rideDisputes/fetchAllRideDisputes",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("admintoken");
    if (!token) {
      return rejectWithValue("No auth token");
    }

    try {
      const response = await axios.get(`${apiUrl}/block_report_remark`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all ride disputes"
      );
    }
  }
);

// Create the slice
const supportSlice = createSlice({
  name: "support",
  initialState,
  reducers: {
    setRideDisputes: (state, action) => {
      state.rideDisputes = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRideDisputes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRideDisputes.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("Fetch fulfilled, payload:", action.payload);
        state.rideDisputes = action.payload;
      })
      .addCase(fetchRideDisputes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchAllRideDisputes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllRideDisputes.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("Fetch all fulfilled, payload:", action.payload);
        state.rideDisputes = action.payload;
      })
      .addCase(fetchAllRideDisputes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

// Export actions
export const { setRideDisputes } = supportSlice.actions;

// Export selectors
export const getRideDisputes = (state) => state.support.rideDisputes;
export const getStatus = (state) => state.support.status;
export const getError = (state) => state.support.error;

// Export reducer
export default supportSlice.reducer;
