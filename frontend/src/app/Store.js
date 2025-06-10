import { configureStore as createStore } from "@reduxjs/toolkit";
import UserReducer from "../slices/UserSlice";
import FriendsReducer from "../slices/FriendsSlice";
import CoversationReducer from "../slices/ConversationSlice";
import RequestReducer from "../slices/RequestsSlice";
import MessageReducer from "../slices/MessageSlice";
import AiMessageReducer from "../slices/AiMessageSlice";
import OtherUsersReducer from "../slices/OtherUserSlice";
import BlockReducer from "../slices/BlockSlice";
const Store = createStore({
  reducer: {
    User: UserReducer,
    Friends: FriendsReducer,
    Block: BlockReducer,
    Conversations: CoversationReducer,
    Requests: RequestReducer,
    OtherUsers: OtherUsersReducer,
    Messages: MessageReducer,
    AiMessages: AiMessageReducer,
  },
});

export default Store;
