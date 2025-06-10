import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  success: null,
  otherUsers: [],
  error: null,
};

export const handleSearchForOtherUserAPI = createAsyncThunk(
  "SEARCH_OTHER_USER",
  async (args, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/search/users?name=${args}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

const OtherUserSlice = createSlice({
  name: "OTHER_USERS",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(handleSearchForOtherUserAPI.fulfilled, (state, action) => {
        console.log("Other Users", action.payload);
        state.otherUsers = action.payload.allUserWithPhotoUrl;
      })
      .addCase(handleSearchForOtherUserAPI.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
  reducers: {
    clearOtherUserError(state) {
      state.error = null;
    },
  },
});
export const { clearOtherUserError } = OtherUserSlice.actions;
export default OtherUserSlice.reducer;
