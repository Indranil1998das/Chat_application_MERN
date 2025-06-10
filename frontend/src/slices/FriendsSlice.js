import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  isloading: false,
  fullFriendProfiles: [],
  basicFriendList: [],
  lastUnfriendedUserId: null,
  onlineFriendIds: [],
  error: null,
};
// search for Friend List
export const handleSearchForFrinedListAPI = createAsyncThunk(
  "SEARCH_FRIEND_LIST",
  async (args, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/search/friends?name=${args}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

// get Friend List
export const handleGetFriendListAPI = createAsyncThunk(
  "GET_FRIEND_LIST",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/friend-list");
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

// get Friend List Only Ids
export const handleGetFriendListOnlyIdsAPI = createAsyncThunk(
  "GET_FRIEND_LIST_IDS",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/friend-list/ids");
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const handleUnfriendAPI = createAsyncThunk(
  "UNFRIEND",
  async (args, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/api/v1/unfriend/${args}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

const FriendsSlice = createSlice({
  name: "FRIENDS",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(handleGetFriendListAPI.pending, (state) => {
        state.isloading = true;
      })
      .addCase(handleGetFriendListAPI.fulfilled, (state, action) => {
        state.isloading = false;
        state.fullFriendProfiles = action.payload.friendListWithPhotoUrl;
      })
      .addCase(handleGetFriendListAPI.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload;
      })
      .addCase(handleSearchForFrinedListAPI.fulfilled, (state, action) => {
        state.fullFriendProfiles = action.payload.searchResult;
      })
      .addCase(handleSearchForFrinedListAPI.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(handleGetFriendListOnlyIdsAPI.fulfilled, (state, action) => {
        state.basicFriendList = action.payload.friendList;
      })
      .addCase(handleGetFriendListOnlyIdsAPI.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(handleUnfriendAPI.fulfilled, (state, action) => {
        state.basicFriendList = action.payload.updatedFriendList;
        state.lastUnfriendedUserId = action.payload.recentlyUnfriendId;
      })
      .addCase(handleUnfriendAPI.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
  reducers: {
    handleToClearErrorForFriends(state) {
      state.error = null;
    },
    handleToClearLastUnfriendedUserId(state) {
      state.lastUnfriendedUserId = null;
    },
    handleToUpdataOnlineUsersInfo(state, action) {
      state.onlineFriendIds = action.payload;
    },
    handleToAddOnlineUserInfo(state, action) {
      state.onlineFriendIds = [...state.onlineFriendIds, action.payload];
    },
    handleToRemoveOnlineUserInfo(state, action) {
      state.onlineFriendIds = state.onlineFriendIds.filter(
        (i) => i !== action.payload
      );
    },
    handleToUpdateFriendListOnlyId(state, action) {
      state.basicFriendList = action.payload;
    },
  },
});

export const {
  handleToClearErrorForFriends,
  handleToClearLastUnfriendedUserId,
  handleToUpdataOnlineUsersInfo,
  handleToAddOnlineUserInfo,
  handleToRemoveOnlineUserInfo,
  handleToUpdateFriendListOnlyId,
} = FriendsSlice.actions;

export default FriendsSlice.reducer;
