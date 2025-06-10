import React from "react";
import HeaderOfConversation from "./HeaderOfConversation";
import MessageList from "./MessageList";
import WriteMessageBox from "./WriteMessageBox";
import ConversationInfo from "./ConverstionInfo";
import { handleToclearAllGetMessagesAndFile } from "../../slices/MessageSlice";
import { handleToUnselecteConversation } from "../../slices/ConversationSlice";
import { useDispatch } from "react-redux";
function ConversationPanel() {
  const Dispatch = useDispatch();
  const [isConversationInfoOpen, setIsConversationInfoOpen] =
    React.useState(false);
  const handleUnselecteUser = () => {
    Dispatch(handleToUnselecteConversation());
    Dispatch(handleToclearAllGetMessagesAndFile());
  };

  const handleToOpenConversationInfo = () => {
    setIsConversationInfoOpen(true);
  };
  const handleToCloseConversationInfo = () => {
    setIsConversationInfoOpen(false);
  };

  const conversationMemo = React.useMemo(() => {
    if (isConversationInfoOpen) {
      return (
        <ConversationInfo
          handleToCloseConversationInfo={handleToCloseConversationInfo}
        />
      );
    }
  }, [isConversationInfoOpen]);
  return (
    <>
      <div className=" h-screen w-screen  md:w-[60%] lg:w-[70%]  absolute  md:sticky  z-50 md:z-0 flex flex-col items-center justify-center text-black  animationCSSRToL active backgroundCss">
        <HeaderOfConversation
          handleUnselecteUser={handleUnselecteUser}
          handleToOpenConversationInfo={handleToOpenConversationInfo}
        />
        <MessageList />
        <WriteMessageBox />
      </div>
      {conversationMemo}
    </>
  );
}

export default React.memo(ConversationPanel);
