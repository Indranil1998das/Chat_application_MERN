import React from "react";
import { IoClose } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import {
  handleFriendRequestStatusChangeAPI,
  handleToClearAllUnnecessaryState,
} from "../../slices/RequestsSlice";
import { handleToAddConversationList } from "../../slices/ConversationSlice";
import RequestSummary from "./RequestSummary";
OtherUserInfo;

import useContext from "../../context/useContext";
import OtherUserInfo from "./OtherUserInfo";
function FriendRequest({
  handleOpenFriendRequestPanel,
  isOpenFriendRequestPanel,
}) {
  const Dispatch = useDispatch();
  const socket = useContext();
  const {
    incomingRequests,
    success_message,
    currentSenderInfo,
    newConversationInfo,
  } = useSelector((state) => state.Requests);
  const { userDetails } = useSelector((state) => state.User);
  const [isOtherUserInfoOpen, setIsOtherUserInfoOpen] = React.useState(false);
  const [otherUserInfo, setOtherUserInfo] = React.useState(null);
  const handleToOtherUserInfoOpen = (data) => {
    setIsOtherUserInfoOpen(true);
    setOtherUserInfo(data);
  };
  const handleToOtherUserInfoClose = () => {
    setIsOtherUserInfoOpen(false);
    setOtherUserInfo(null);
  };
  const handleChangeStatus = (id, status, data) => {
    Dispatch(
      handleFriendRequestStatusChangeAPI({
        id: id,
        status: status,
        data: data,
      })
    );
  };

  const otherUserMemo = React.useMemo(() => {
    if (isOtherUserInfoOpen) {
      return (
        <OtherUserInfo
          handleToOtherUserInfoClose={handleToOtherUserInfoClose}
          data={otherUserInfo}
        />
      );
    }
    return <></>;
  }, [isOtherUserInfoOpen]);
  React.useEffect(() => {
    if (success_message === "successfully accepted") {
      socket?.emit("friendRequestApproved", {
        userId: userDetails._id,
        senderId: currentSenderInfo._id,
        conversationId: newConversationInfo.id,
        createdAt: newConversationInfo.createdAt,
        messageLength: newConversationInfo.messageLength,
      });
      Dispatch(
        handleToAddConversationList({
          userInfo: currentSenderInfo,
          conversationId: newConversationInfo.id,
          createdAt: newConversationInfo.createdAt,
          messageLength: newConversationInfo.messageLength,
        })
      );
    }
    if (success_message === "successfully rejected") {
      socket?.emit("friendRequestRejected", {
        userId: userDetails._id,
        senderId: currentSenderInfo._id,
      });
    }
    Dispatch(handleToClearAllUnnecessaryState());
  }, [success_message]);
  return (
    <>
      <div
        className={`w-full h-full   absolute top-0 bg-white z-50 px-3 pt-2 transition-all duration-300 transform scale-0 opacity-0 ${
          isOpenFriendRequestPanel ? "scale-100 opacity-100" : ""
        }`}
      >
        <div className=" flex justify-between items-center mb-5">
          <h1 className=" font-bold text-3xl ">{`Friend Requests(${incomingRequests.length})`}</h1>
          <button
            className=" text-[8vmin] sm:text-[5vmin] p-1 cursor-pointer hover:bg-green-300 rounded-full duration-500"
            onClick={handleOpenFriendRequestPanel}
          >
            <IoClose />
          </button>
        </div>
        <div className=" h-full  w-full overflow-auto hiddenScrollbar pb-32 mt-3">
          {incomingRequests.length === 0 ? (
            <>
              <div className=" h-full w-full flex items-center justify-center">
                <span className=" font-thin text-2xl">No Requests Found </span>
              </div>
            </>
          ) : (
            <>
              {incomingRequests.map((data) => (
                <RequestSummary
                  key={data._id}
                  data={data.senderInfo}
                  id={data._id}
                  handleChangeStatus={handleChangeStatus}
                  handleToOtherUserInfoOpen={handleToOtherUserInfoOpen}
                />
              ))}
            </>
          )}
        </div>
      </div>
      {otherUserMemo}
    </>
  );
}

export default FriendRequest;
