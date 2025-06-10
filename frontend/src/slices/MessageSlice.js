import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  isLoadingForSendFilesAndMessages: null,
  isLoadingForGetMessages: null,
  getMessagesOrFile: [],
  lastMessage: [],
  filesKey: null,
  uploadUrlForFiles: null,
  recentSendingMessage: null,
  notificationOfMessage: [],
  error: null,
};

export const handleToGetMessageAPI = createAsyncThunk(
  "GET_MESSAGE",
  async (args, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/message/${args}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const handleToGetLastMessagesAPI = createAsyncThunk(
  "GET_LAST_MESSAGES",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/last/messages");
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const handleToSendMessageAPI = createAsyncThunk(
  "SEND_MESSAGE",
  async (args, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        `/api/v1/message/send/${args.id}`,
        {
          message: args.message || null,
          fileKey: args.fileKey || null,
          fileType: args.fileType || null,
        },
        config
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const handleToGetUploadUrlForFilesAPI = createAsyncThunk(
  "GET_UPLOAD_URL_FOR_FILES",
  async (args, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.get(`/api/v1/file/upload-url`, {
        params: {
          fileType: args.fileType,
          fileName: args.fileName,
        },
        config,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const handleToGetNotificationAPI = createAsyncThunk(
  "GET_NOTIFICATION",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/notification");
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const handleToAddNotificationAPI = createAsyncThunk(
  "ADD_NOTIFICATION",
  async (args, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/v1/notification/add",
        { data: args },
        config
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const handleToClearNotificationAPI = createAsyncThunk(
  "CLEAR_NOTIFICATION",
  async (args, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/v1/notification/clear",
        { senderId: args },
        config
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

const messageSlice = createSlice({
  name: "messageSilce",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(handleToGetMessageAPI.pending, (state) => {
        state.isLoadingForGetMessages = true;
      })
      .addCase(handleToGetMessageAPI.fulfilled, (state, action) => {
        state.isLoadingForGetMessages = false;
        state.getMessagesOrFile = action.payload.messagesOrFiles;
      })
      .addCase(handleToGetMessageAPI.rejected, (state, action) => {
        state.isLoadingForGetMessages = false;
        state.error = action.payload;
      })
      .addCase(handleToGetLastMessagesAPI.fulfilled, (state, action) => {
        state.lastMessage = action.payload.lastMessage;
      })
      .addCase(handleToGetLastMessagesAPI.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(handleToSendMessageAPI.fulfilled, (state, action) => {
        state.getMessagesOrFile = [
          ...state.getMessagesOrFile,
          action.payload.messageInfoForSender,
        ];
        state.recentSendingMessage = action.payload.messageInfoForSender;
        state.isLoadingForSendFilesAndMessages = false;
        state.uploadUrlForFiles = null;
        state.filesKey = null;
      })
      .addCase(handleToSendMessageAPI.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoadingForSendFilesAndMessages = false;
      })
      .addCase(handleToGetUploadUrlForFilesAPI.fulfilled, (state, action) => {
        state.uploadUrlForFiles = action.payload.uploadUrl;
        state.filesKey = action.payload.key;
      })
      .addCase(handleToGetUploadUrlForFilesAPI.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(handleToAddNotificationAPI.fulfilled, (state, action) => {
        state.notificationOfMessage = [
          ...state.notificationOfMessage,
          action.payload.notification,
        ];
      })
      .addCase(handleToAddNotificationAPI.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(handleToGetNotificationAPI.fulfilled, (state, action) => {
        state.notificationOfMessage = action.payload.notifications;
      })
      .addCase(handleToGetNotificationAPI.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(handleToClearNotificationAPI.fulfilled, (state, action) => {
        state.notificationOfMessage = action.payload.updateNotificationList;
      })
      .addCase(handleToClearNotificationAPI.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
  reducers: {
    handleToClearErrorInMessage(state) {
      state.error = null;
    },
    handleToClearRecentStates(state) {
      state.recentSendingMessage = null;
      state.uploadUrlForFiles = null;
      state.filesKey = null;
    },
    handleToIsLoading(state) {
      state.isLoadingForSendFilesAndMessages = true;
    },
    handleToAddRealTimeMessage(state, action) {
      state.getMessagesOrFile = [...state.getMessagesOrFile, action.payload];
    },
    handleToAddLastMessage(state, action) {
      let newMessage = null;
      if (!action.payload.fileType) {
        newMessage = {
          id: action.payload.receiverId,
          lastMessage: action.payload.message,
          fileType: null,
          createdAt: action.payload.createdAt,
        };
      } else {
        newMessage = {
          id: action.payload.receiverId,
          lastMessage: "File",
          fileType: action.payload.fileType,
          createdAt: action.payload.createdAt,
        };
      }
      if (state.lastMessage.length !== 0) {
        const existingIndex = state.lastMessage.findIndex(
          (i) => i.id === newMessage.id
        );
        if (existingIndex !== -1) {
          state.lastMessage[existingIndex] = newMessage;
        } else {
          state.lastMessage.push(newMessage);
        }
      } else {
        state.lastMessage.push(newMessage);
      }
    },
    handleToclearAllGetMessagesAndFile(state) {
      state.getMessagesOrFile = [];
    },
  },
});

export const {
  handleToClearErrorInMessage,
  handleToClearRecentStates,
  handleToIsLoading,
  handleToAddRealTimeMessage,
  handleToAddLastMessage,
  handleToclearAllGetMessagesAndFile,
} = messageSlice.actions;
export default messageSlice.reducer;
