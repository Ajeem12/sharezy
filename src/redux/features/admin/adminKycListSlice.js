import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const token = localStorage.getItem("admintoken");

const axiosConfig = {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
};

const apiUrl = import.meta.env.VITE_API_URL;

export const fetchAdmins = createAsyncThunk(
  "admin/fetchAdmins",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/ekyc_by_admin`, axiosConfig);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createAdmin = createAsyncThunk(
  "admin/createAdmin",
  async (adminData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${apiUrl}/ekyc_by_admin`,
        adminData,
        axiosConfig
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getKycById = createAsyncThunk(
  "admin/getKycById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${apiUrl}/ekyc_by_admin/${id}`,
        axiosConfig
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const adminKycListSlice = createSlice({
  name: "admin",
  initialState: {
    admins: [],
    currentKyc: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetAdminState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentKyc = null;
    },
    clearCurrentKyc: (state) => {
      state.currentKyc = null;
    },
    updateKycStatusLocally: (state, action) => {
      const { id, status } = action.payload;
      if (state.admins.data) {
        state.admins.data = state.admins.data.map((kyc) =>
          kyc.id === id ? { ...kyc, status } : kyc
        );
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = action.payload;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admins.data.push(action.payload);
        state.success = true;
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(getKycById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentKyc = null;
      })
      .addCase(getKycById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentKyc = action.payload;
      })
      .addCase(getKycById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetAdminState, clearCurrentKyc, updateKycStatusLocally } =
  adminKycListSlice.actions;
export default adminKycListSlice.reducer;
