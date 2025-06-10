import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  success_message: null,
  isLoading: false,
  sentRequests: [],
  lastCancelledRequestUserId: null,
  currentSenderInfo: null,
  newConversationInfo: null,
  incomingRequests: [],
  error: null,
};

export const handelGetSendingRequestsAPI = createAsyncThunk(
  "GET_SEND_REQUEST",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/requests/send`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const handleToSendRequestAPI = createAsyncThunk(
  "POST_SEND_REQUEST",
  async (args, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`/api/v1/send/request/${args}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const handleTocancelFriendRequest = createAsyncThunk(
  "CANCEL_FRIEND_REQUEST",
  async (args, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/api/v1/cancel/request/${args}`);
      return {
        data: data,
        id: args,
      };
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const handleToGetRequestsAPI = createAsyncThunk(
  "GET_REQUEST",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/requests");
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const handleFriendRequestStatusChangeAPI = createAsyncThunk(
  "PUT_REQUEST_STATUS",
  async (args, { rejectWithValue }) => {
    try {
      let { data } = await axios.put(
        `/api/v1/request/status/change?reqId=${args.id}&status=${args.status}`
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

const RequestsSlice = createSlice({
  name: "incomingRequests",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(handleToGetRequestsAPI.fulfilled, (state, action) => {
        state.incomingRequests = action.payload.requestedDatas;
      })
      .addCase(handleToGetRequestsAPI.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(handelGetSendingRequestsAPI.fulfilled, (state, action) => {
        state.sentRequests = action.payload.requests;
      })
      .addCase(handelGetSendingRequestsAPI.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(handleToSendRequestAPI.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(handleToSendRequestAPI.fulfilled, (state, action) => {
        state.sentRequests = action.payload.data;
        state.isLoading = false;
        state.success_message = "Successfully send request";
      })
      .addCase(handleToSendRequestAPI.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(handleTocancelFriendRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(handleTocancelFriendRequest.fulfilled, (state, action) => {
        state.sentRequests = action.payload.data.updatedReqData;
        state.lastCancelledRequestUserId = action.payload.id;
        state.isLoading = false;
        state.success_message = "Successfully Cancel request";
      })
      .addCase(handleTocancelFriendRequest.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(handleFriendRequestStatusChangeAPI.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        handleFriendRequestStatusChangeAPI.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.success_message = action.payload.message;
          if (action.payload.message === "successfully accepted") {
            state.currentSenderInfo = action.payload.senderInfo;
            state.newConversationInfo = action.payload.conversationInfo;
          }
          if (action.payload.message === "successfully rejected") {
            state.currentSenderInfo = action.payload.senderInfo;
          }
          state.incomingRequests = state.incomingRequests.filter(
            (i) => i.senderInfo._id !== action.payload.senderInfo._id
          );
        }
      )
      .addCase(handleFriendRequestStatusChangeAPI.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
  reducers: {
    handleToClearErrrorForRequest(state) {
      state.error = null;
      state.lastCancelledRequestUserId = null;
      state.currentSenderInfo = null;
      state.newConversationInfo = null;
      state.success_message = null;
    },
    handleToClearAllUnnecessaryState(state) {
      state.lastCancelledRequestUserId = null;
      state.currentSenderInfo = null;
      state.newConversationInfo = null;
      state.success_message = null;
    },
    handleToAddRequest(state, action) {
      state.incomingRequests = [...state.incomingRequests, action.payload];
    },
    handleToRemoveRequest(state, action) {
      state.incomingRequests = state.incomingRequests.filter(
        (i) => i._id !== action.payload._id
      );
    },
    handleToRemoveSendedRequest(state, action) {
      state.sentRequests = state.sentRequests.filter(
        (i) => i !== action.payload
      );
    },
  },
});

export const {
  handleToClearErrrorForRequest,
  handleToClearAllUnnecessaryState,
  handleToAddRequest,
  handleToRemoveRequest,
  handleToRemoveSendedRequest,
} = RequestsSlice.actions;

export default RequestsSlice.reducer;
