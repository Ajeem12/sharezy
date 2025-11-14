import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../utils/Client";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const fetchAdminProfile = createAsyncThunk(
  "admin/fetchProfile",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("admintoken");
      const response = await axios.get(`${apiUrl}/admin_fetch_profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch admin profile"
      );
    }
  }
);

const initialState = {
  profile: null,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const adminProfileSlice = createSlice({
  name: "adminProfile",
  initialState,
  reducers: {
    clearAdminProfileState: (state) => {
      state.profile = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAdminProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(fetchAdminProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearAdminProfileState } = adminProfileSlice.actions;

export default adminProfileSlice.reducer;
