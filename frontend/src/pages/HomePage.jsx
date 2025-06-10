import React from "react";
import AnotherInstanceActivePage from "./AnotherInstanceActivePage";
import LeftSideBar from "../components/LeftSideBar";
import ChatDeshBoard from "../components/UserAndStatusAndFriendComponents/ChatDeshBoard";
import ConversationPanel from "../components/ConversationComponents/ConversationPanel";
import NoConversationPanel from "../components/ConversationComponents/NoConversationPanel";
import AiConversationPanel from "../components/AiConversationComponents/AiConversationPanel";
import UserInfo from "../components/UserInfo";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import useSocket from "../context/useContext";
import {
  handleToAddConversationList,
  handleToUpadateConversationList,
  handleToUnselecteConversation,
} from "../slices/ConversationSlice";
import {
  handleToAddOnlineUserInfo,
  handleToRemoveOnlineUserInfo,
  handleToUpdataOnlineUsersInfo,
  handleToUpdateFriendListOnlyId,
} from "../slices/FriendsSlice";
import {
  handleAddToWhoBlockMe,
  handleAddToRemoveWhoBlockMe,
} from "../slices/BlockSlice";
import {
  handleToAddRequest,
  handleToRemoveRequest,
  handleToRemoveSendedRequest,
} from "../slices/RequestsSlice";
function HomePage() {
  const socket = useSocket();
  const Dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.User);
  const { selectedConversation } = useSelector((state) => state.Conversations);
  const menuRef = React.useRef(null);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = React.useState(false);
  const [isAiConversationPanelOpen, setIsAiConversationPanelOpen] =
    React.useState(false);
  const [isUserInfoOpen, setIsUserInfoOpen] = React.useState(false);
  const [isAnotherInstanceActive, setIsAnotherInstanceActive] =
    React.useState(false);
  // Handle User info
  const handleUserInfoOpen = React.useCallback(() => {
    setIsUserInfoOpen(true);
    setIsLeftSidebarOpen(false);
  }, [isUserInfoOpen]);
  const handleUserInfoClose = React.useCallback(() => {
    setIsUserInfoOpen(false);
  }, [isUserInfoOpen]);
  const leftSideMenuMemo = React.useMemo(() => {
    if (isLeftSidebarOpen) {
      return (
        <LeftSideBar
          menuRef={menuRef}
          isLeftSidebarOpen={isLeftSidebarOpen}
          handleUserInfoOpen={handleUserInfoOpen}
        />
      );
    }
  }, [isLeftSidebarOpen]);
  const handleLeftSidebarOpen = () => {
    setIsLeftSidebarOpen(true);
  };
  const handleToAiConversation = () => {
    setIsAiConversationPanelOpen(!isAiConversationPanelOpen);
    if (selectedConversation) {
      Dispatch(handleToUnselecteConversation());
    }
  };
  // UseEffect
  React.useEffect(() => {
    const handleLeftSidebarOutSideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsLeftSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleLeftSidebarOutSideClick);
    return () => {
      document.removeEventListener("mousedown", handleLeftSidebarOutSideClick);
    };
  }, []);
  React.useEffect(() => {
    if (!socket || !userDetails) return;
    socket.emit("addNewConnection", userDetails._id);
    return () => socket.off("addNewConnection", userDetails._id);
  }, [socket, userDetails]);
  React.useEffect(() => {
    if (selectedConversation) {
      setIsAiConversationPanelOpen(false);
    }
  }, [selectedConversation]);
  React.useEffect(() => {
    const handleToAddWhoBlock = (data) => {
      Dispatch(handleToUpadateConversationList(data));
      Dispatch(handleAddToWhoBlockMe(data));
    };
    const handleToRemoveWhoBlock = (data) => {
      Dispatch(handleToUpadateConversationList(data));
      Dispatch(handleAddToRemoveWhoBlockMe(data));
    };
    const handleToUpdateFriendList = (data) => {
      Dispatch(handleToUpdateFriendListOnlyId(data));
    };
    const handleAddToOnline = (data) => {
      Dispatch(handleToAddOnlineUserInfo(data));
    };
    const handleRemoveToOnline = (data) => {
      Dispatch(handleToRemoveOnlineUserInfo(data));
    };

    const handleToUpdateOnlineUsers = (data) => {
      Dispatch(handleToUpdataOnlineUsersInfo(data));
    };
    const handleUserActiveElsewhere = () => {
      setIsAnotherInstanceActive(true);
    };
    const handleToAddRequests = (data) => {
      toast.info("New Friend Request!!");
      Dispatch(handleToAddRequest(data));
    };
    const handleToCancelRequests = (data) => {
      Dispatch(handleToRemoveRequest(data));
    };
    const handleToRejectedRequest = (data) => {
      Dispatch(handleToRemoveSendedRequest(data));
    };
    const handleToUpdateList = (data) => {
      toast.info(
        `${data.conversationInfoWithOtherUserInfo.userInfo.fullName} accepted your Friend Request.`
      );
      Dispatch(
        handleToAddConversationList(data.conversationInfoWithOtherUserInfo)
      );
      Dispatch(handleToUpdateFriendListOnlyId(data.updatedfriendList));
    };

    const handleToUpdateFriendProfile = (data) => {
      Dispatch(handleToUpadateConversationList(data.userInfoWithOutFriendList));
    };

    socket?.on("recentlyBlockYou", handleToAddWhoBlock);
    socket?.on("recentlyUnBlockYou", handleToRemoveWhoBlock);
    socket?.on("userActiveElsewhere", handleUserActiveElsewhere);
    socket?.on("newRequestCame", handleToAddRequests);
    socket?.on("cancelRequestFromUser", handleToCancelRequests);
    socket?.on("ApprovedRequest", handleToUpdateList);
    socket?.on("RejectedRequest", handleToRejectedRequest);
    socket?.on("updateFriendList", handleToUpdateFriendList);
    socket?.on("onlineUser", handleAddToOnline);
    socket?.on("offlineUser", handleRemoveToOnline);
    socket?.on("AllOnlineUsers", handleToUpdateOnlineUsers);
    socket?.on("updatedFriendProfile", handleToUpdateFriendProfile);
    return () => {
      socket?.off("recentlyBlockYou", handleToAddWhoBlock);
      socket?.off("recentlyUnBlockYou", handleToRemoveWhoBlock);
      socket?.off("userActiveElsewhere", handleUserActiveElsewhere);
      socket?.off("newRequestCame", handleToAddRequests);
      socket?.off("cancelRequestFromUser", handleToCancelRequests);
      socket?.off("ApprovedRequest", handleToUpdateList);
      socket?.off("RejectedRequest", handleToRejectedRequest);
      socket?.off("updateFriendList", handleToUpdateFriendList);
      socket?.off("onlineUser", handleAddToOnline);
      socket?.off("offlineUser", handleRemoveToOnline);
      socket?.off("AllOnlineUsers", handleToUpdateOnlineUsers);
      socket?.off("updatedFriendProfile", handleToUpdateFriendProfile);
    };
  }, [socket]);

  const userInfoMemo = React.useMemo(() => {
    if (isUserInfoOpen) {
      return (
        <UserInfo
          handleUserInfoClose={handleUserInfoClose}
          isUserInfoOpen={isUserInfoOpen}
        />
      );
    }
  }, [isUserInfoOpen]);

  const conversationMemo = React.useMemo(() => {
    if (isAiConversationPanelOpen) {
      return (
        <AiConversationPanel handleToAiConversation={handleToAiConversation} />
      );
    } else {
      if (selectedConversation) {
        return <ConversationPanel />;
      } else {
        return <NoConversationPanel />;
      }
    }
  }, [isAiConversationPanelOpen, selectedConversation]);
  return (
    <>
      {isAnotherInstanceActive ? (
        <AnotherInstanceActivePage />
      ) : (
        <div className=" w-screen h-screen  fixed">
          {leftSideMenuMemo}
          <div className=" w-full h-full flex flex-row ">
            <ChatDeshBoard
              isAiConversationPanelOpen={isAiConversationPanelOpen}
              handleLeftSidebarOpen={handleLeftSidebarOpen}
              handleToAiConversation={handleToAiConversation}
            />
            {conversationMemo}
          </div>
          {userInfoMemo}
        </div>
      )}
    </>
  );
}

export default HomePage;
