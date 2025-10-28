import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl =import.meta.env.VITE_API_URL;

// Thunk to call POST user_status_change/{userid}
export const changeUserStatus = createAsyncThunk(
  "user/changeUserStatus",
  async ({ userId, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("admintoken");

      const response = await axios.post(
        `${apiUrl}/user_status_change/${userId}`,
        { status }, // send status in body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to change user status"
      );
    }
  }
);



const userStatusSlice = createSlice({
  name: "userStatus",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetUserStatusState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changeUserStatus.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(changeUserStatus.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(changeUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { resetUserStatusState } = userStatusSlice.actions;
export default userStatusSlice.reducer;
