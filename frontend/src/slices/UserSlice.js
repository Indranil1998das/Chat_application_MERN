import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  isLoading: null,
  userDetails: null,
  success: null,
  success_message: null,
  isAuthenticared: null,
  error: null,
};

// Login
export const handleLoginAPI = createAsyncThunk(
  "LOGIN",
  async (args, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/v1/login",
        {
          userEmail: args.email,
          password: args.password,
        },
        config
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

// Get Logged User Details
export const handleLoggedUserAPI = createAsyncThunk(
  "GET_LOGGED_USER_DETAILS",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/logged/user");
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

//LogOut
export const handleLogoutAPI = createAsyncThunk(
  "LOGOUT",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.put("/api/v1/logout");
      return data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

//Signup
export const handleSignupAPI = createAsyncThunk(
  "SIGNUP",
  async (args, { rejectWithValue }) => {
    try {
      let fullName = args.name;
      let userEmail = args.email;
      let password = args.password;
      let confirmPassword = args.confirmPassword;
      let profilePhoto = args.profilePhoto;
      let gender = args.gender;
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/v1/signup",
        {
          fullName,
          userEmail,
          password,
          confirmPassword,
          gender,
          profilePhoto,
        },
        config
      );

      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

// Change Password
export const handleChangePasswordAPI = createAsyncThunk(
  "CHANGE_PASSWORD",
  async (args, { rejectWithValue }) => {
    console.log("Change Password Args:", args);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.put(
        "/api/v1/password/change",
        {
          currentPassword: args.currentPassword,
          newPassword: args.newPassword,
          confirmPassword: args.confirmPassword,
        },
        config
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

//Change Profile Photo
export const handleChangeProfilePhotoAPI = createAsyncThunk(
  "CHANGE_PROFILE_PHOTO",
  async (args, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.put(
        "/api/v1/profile/photo/change",
        {
          changePhoto: args,
        },
        config
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const handleToForgetPasswordAPI = createAsyncThunk(
  "FORGET_PASSWORD",
  async (args, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/password/forgot/${args}`);
      console.log(args);
      console.log(data);

      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const handleToResetPasswordAPI = createAsyncThunk(
  "RESET_PASSWORD",
  async (args, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.put(
        `/api/v1/reset-password/${args.token}`,
        {
          newPassword: args.newPassword,
          confirmPassword: args.confirmPassword,
        },
        config
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

const userSlice = createSlice({
  name: "USER",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(handleLoginAPI.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(handleLoginAPI.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticared = true;
        state.success = true;
        state.success_message = "Login successful";
        state.userDetails = action.payload.userData;
      })
      .addCase(handleLoginAPI.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error = action.payload;
      })
      .addCase(handleLoggedUserAPI.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(handleLoggedUserAPI.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.isAuthenticared = action.payload.authentication;
        state.userDetails = action.payload.data;
      })
      .addCase(handleLoggedUserAPI.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error = action.payload;
      })
      .addCase(handleLogoutAPI.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(handleLogoutAPI.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
        state.success_message = "Logout successful";
        state.isAuthenticared = false;
        state.userDetails = null;
      })
      .addCase(handleLogoutAPI.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error = action.payload.data;
      })
      .addCase(handleSignupAPI.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(handleSignupAPI.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.success_message = "SignUp successful";
        state.userDetails = action.payload.data;
      })
      .addCase(handleSignupAPI.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error = action.payload;
      })
      .addCase(handleChangePasswordAPI.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(handleChangePasswordAPI.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.success_message = action.payload.message;
      })
      .addCase(handleChangePasswordAPI.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error = action.payload;
      })
      .addCase(handleChangeProfilePhotoAPI.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(handleChangeProfilePhotoAPI.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.success_message = action.payload.message;
        state.userDetails = action.payload.data;
      })
      .addCase(handleChangeProfilePhotoAPI.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error = action.payload;
      })
      .addCase(handleToForgetPasswordAPI.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(handleToForgetPasswordAPI.fulfilled, (state, action) => {
        state.success = true;
        state.isLoading = false;
        state.success_message = action.payload.message;
      })
      .addCase(handleToForgetPasswordAPI.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(handleToResetPasswordAPI.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(handleToResetPasswordAPI.fulfilled, (state, action) => {
        state.success = true;
        state.isLoading = false;
        state.success_message = action.payload.message;
      })
      .addCase(handleToResetPasswordAPI.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
  reducers: {
    handleToClearErrorAndSucces(state) {
      state.error = null;
      state.success = null;
      state.success_message = null;
      state.recentUnfriendedId = null;
    },
  },
});

export const { handleToClearErrorAndSucces } = userSlice.actions;

export default userSlice.reducer;
