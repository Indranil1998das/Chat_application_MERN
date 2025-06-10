import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  isLoading: null,
  success: null,
  success_message: null,
  selectedConversation: null,
  conversationList: [],
  error: null,
};

export const handleGetConversationListAPI = createAsyncThunk(
  "GET_CONVERSATION_LIST",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/converstion-list");
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const handleSearchConversationListAPI = createAsyncThunk(
  "SEARCH_CONVERSATION",
  async (args, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `/api/v1/find/conversation?panterName=${args}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const ConversationSlice = createSlice({
  name: "CONVERSATION",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(handleGetConversationListAPI.fulfilled, (state, action) => {
        state.conversationList = action.payload.conversationList;
      })
      .addCase(handleGetConversationListAPI.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(handleSearchConversationListAPI.fulfilled, (state, action) => {
        state.conversationList = action.payload.searchResult;
      })
      .addCase(handleSearchConversationListAPI.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
  reducers: {
    handleToClearErrorOfConversation(state) {
      state.error = null;
    },
    handleToSelectConversation(state, action) {
      state.selectedConversation = action.payload;
    },
    handleToUnselecteConversation(state) {
      state.selectedConversation = null;
    },
    handleToAddConversationList(state, action) {
      const existingIndex = state.conversationList.findIndex(
        (i) => i.conversationId === action.payload.conversationId
      );
      if (existingIndex !== -1) {
        state.conversationList[existingIndex] = action.payload;
      } else {
        state.conversationList = [...state.conversationList, action.payload];
      }
    },
    handleToUpadateConversationList(state, action) {
      const Index = state.conversationList.findIndex(
        (i) => i.userInfo._id === action.payload._id
      );
      if (!Index >= -1) {
        state.conversationList[Index].userInfo = action.payload;
      }
    },
  },
});

export const {
  handleToClearErrorOfConversation,
  handleToSelectConversation,
  handleToUpadateConversationList,
  handleToUnselecteConversation,
  handleToAddConversationList,
} = ConversationSlice.actions;
export default ConversationSlice.reducer;
