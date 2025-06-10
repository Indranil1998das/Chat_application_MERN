import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  aiMessages: [],
  error: null,
};

export const handleToSendMessageToAIAPI = createAsyncThunk(
  "SEND_AI_MESSAGE",
  async (args, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/v1/send/message/ai",
        {
          message: args,
        },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

const AiMessageSlice = createSlice({
  name: "aiMessageSlice",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(handleToSendMessageToAIAPI.fulfilled, (state, action) => {
        state.aiMessages = [...state.aiMessages, action.payload];
      })
      .addCase(handleToSendMessageToAIAPI.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
  reducers: {
    handleToclearErrorAiMessage(state) {
      state.error = null;
    },
    handleToaddSendMessage(state, action) {
      state.aiMessages = [...state.aiMessages, action.payload];
    },
  },
});

export const { handleToclearErrorAiMessage, handleToaddSendMessage } =
  AiMessageSlice.actions;
export default AiMessageSlice.reducer;
