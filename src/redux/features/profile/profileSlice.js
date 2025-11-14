import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../utils/Client";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

// Thunk: Save Profile
export const saveProfile = createAsyncThunk(
  "profile/saveProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(
        `${apiUrl}/update_profile`,
        profileData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

// Thunk: Fetch Profile
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/fetch_profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

// Slice
const profileSlice = createSlice({
  name: "profile",
  initialState: {
    data: {
      id: null,
      name: "",
      email: "",
      email_verified_at: null,
      created_at: "",
      updated_at: "",
      mobile: "",
      role: null,
      otp: null,
      expires_at: null,
      profile_image: null,
      location: null,
      status: null,
      commission: null,
      kyc_details: null,
    },
    image: {
      file: null,
      preview: null,
    },
    status: "idle",
    error: null,
  },
  reducers: {
    updateProfileField: (state, action) => {
      state.data[action.payload.field] = action.payload.value;
    },
    setImage: (state, action) => {
      state.image = {
        file: action.payload.file,
        preview: action.payload.preview,
      };
    },
    resetProfileImage: (state) => {
      state.image = {
        file: null,
        preview: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Update all fields from the response
        state.data = { ...state.data, ...action.payload };
        state.image.preview = action.payload.profile_image;
        state.image.file = null; // Clear the file after successful upload
      })
      .addCase(saveProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Store all user data from the response
        state.data = action.payload;
        state.image.preview = action.payload.profile_image;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { updateProfileField, setImage, resetProfileImage } =
  profileSlice.actions;
export default profileSlice.reducer;
