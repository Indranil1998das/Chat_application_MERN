import React from "react";
import { toast } from "react-toastify";
import ConversationSummary from "./ConversationSummary";
import { useSelector, useDispatch } from "react-redux";
import {
  handleGetConversationListAPI,
  handleToSelectConversation,
  handleSearchConversationListAPI,
  handleToClearErrorOfConversation,
} from "../../slices/ConversationSlice";
import {
  handleToGetMessageAPI,
  handleToClearNotificationAPI,
  handleToClearErrorInMessage,
} from "../../slices/MessageSlice";
function ConversationList() {
  const Dispatch = useDispatch();
  const [searchInput, setSearchInput] = React.useState("");
  const { conversationList } = useSelector((state) => state.Conversations);
  const { selectedConversation, error } = useSelector(
    (state) => state.Conversations
  );
  const messageError = useSelector((state) => state.Messages.error);
  const handleSelectConversation = (data) => {
    if (selectedConversation && selectedConversation._id === data._id) {
      return;
    }
    Dispatch(handleToGetMessageAPI(data.userInfo._id));
    Dispatch(handleToClearNotificationAPI(data.userInfo._id));
    Dispatch(handleToSelectConversation(data));
  };

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
    Dispatch(handleSearchConversationListAPI(e.target.value));
  };
  React.useEffect(() => {
    Dispatch(handleGetConversationListAPI());
  }, [Dispatch]);

  React.useEffect(() => {
    if (messageError) {
      toast.error(messageError);
      Dispatch(handleToClearErrorInMessage());
    }
    if (error) {
      toast.error(error);
      Dispatch(handleToClearErrorOfConversation());
    }
  }, [messageError, error, Dispatch]);

  return (
    <>
      <div className=" w-full flex relative  flex-col items-start p-1">
        <span className=" font-semibold text-xl">Conversation</span>
        <div className="w-full  mt-1 p-1 rounded-md">
          <input
            type="text"
            placeholder="Search your Friend Name"
            value={searchInput}
            onChange={handleSearchInput}
            className=" w-full py-1  shadow-xl  shadow-green-300/35 px-2 rounded-md focus:outline-none"
          />
        </div>
      </div>
      <div className="pb-48  w-full h-full">
        {conversationList.length !== 0 ? (
          <>
            {conversationList.map((data, index) => (
              <ConversationSummary
                key={index}
                data={data.userInfo}
                fullData={data}
                handleSelectConversation={handleSelectConversation}
              />
            ))}
          </>
        ) : (
          <div className="w-full h-full flex justify-center items-center   flex-col gap-2">
            <span className="text-gray-500 text-lg">
              No Conversations Found
            </span>
          </div>
        )}
      </div>
    </>
  );
}

export default ConversationList;
