import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  lastBlockedUserId: null,
  lastUnblockedUserId: null,
  blockedUsersInfo: [],
  usersWhoBlockedMe: [],
  error: null,
};

export const handleGetBlockListAPI = createAsyncThunk(
  "GET_BLOCK_LIST",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/block-list");
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const handleGetWhoBlockMeAPI = createAsyncThunk(
  "GET_WHO_BLOCK_ME",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/who/block-me");
      return data;
    } catch (error) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const handleBlockUserAPI = createAsyncThunk(
  "BLOCK_USER",
  async (args, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`/api/v1/block/user/add/${args}`);
      return data;
    } catch (error) {
      return rejectWithValue(err.response.data.message);
    }
  }
);
export const handleUnblockUserAPI = createAsyncThunk(
  "UNBLOCK_USER",
  async (args, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/api/v1/unblock/${args}`);
      return data;
    } catch (error) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

const BlockSlice = createSlice({
  name: "Block",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(handleGetBlockListAPI.fulfilled, (state, action) => {
        state.blockedUsersInfo = action.payload.BlockList;
      })
      .addCase(handleGetBlockListAPI.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(handleGetWhoBlockMeAPI.fulfilled, (state, action) => {
        state.usersWhoBlockedMe = action.payload.blockMeList;
      })
      .addCase(handleGetWhoBlockMeAPI.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(handleBlockUserAPI.fulfilled, (state, action) => {
        state.lastBlockedUserId = action.payload.BlockUserInfo._id;
        state.blockedUsersInfo = [
          ...state.blockedUsersInfo,
          action.payload.BlockUserInfo,
        ];
      })
      .addCase(handleBlockUserAPI.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(handleUnblockUserAPI.fulfilled, (state, action) => {
        state.lastUnblockedUserId = action.payload.unblockUserId;
        state.blockedUsersInfo = state.blockedUsersInfo.filter(
          (i) => i._id !== action.payload.unblockUserId
        );
      })
      .addCase(handleUnblockUserAPI.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
  reducers: {
    handleToClearErrorForBlockList(state) {
      state.error = null;
    },
    handleToClearLastBlockUser(state) {
      state.lastBlockedUserId = null;
      state.lastUnblockedUserId = null;
    },
    handleAddToWhoBlockMe(state, action) {
      state.usersWhoBlockedMe = [...state.usersWhoBlockedMe, action.payload];
    },
    handleAddToRemoveWhoBlockMe(state, action) {
      state.usersWhoBlockedMe = state.usersWhoBlockedMe.filter(
        (i) => i._id !== action.payload._id
      );
    },
  },
});

export const {
  handleToClearErrorForBlockList,
  handleToClearLastBlockUser,
  handleAddToWhoBlockMe,
  handleAddToRemoveWhoBlockMe,
} = BlockSlice.actions;

export default BlockSlice.reducer;
