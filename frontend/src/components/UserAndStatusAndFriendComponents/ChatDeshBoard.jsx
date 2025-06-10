import React, { lazy, Suspense } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { GoDotFill } from "react-icons/go";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { handleToGetRequestsAPI } from "../../slices/RequestsSlice";
import {
  handleToAddRealTimeMessage,
  handleToGetNotificationAPI,
  handleToAddNotificationAPI,
  handleToGetLastMessagesAPI,
  handleToAddLastMessage,
} from "../../slices/MessageSlice";
import {
  handleGetBlockListAPI,
  handleToClearErrorForBlockList,
  handleGetWhoBlockMeAPI,
} from "../../slices/BlockSlice";

import {
  handleGetFriendListOnlyIdsAPI,
  handleToClearErrorForFriends,
} from "../../slices/FriendsSlice";
import { toast } from "react-toastify";
const ConversationList = lazy(() => import("./ConversationList"));
import AddNewFriend from "./AddNewFriend";
import FriendRequest from "./FriendRequest";
import LoaderCompo from "../LoaderCompo";
import useSocket from "../../context/useContext";
function ChatDeshBoard({
  handleLeftSidebarOpen,
  handleToAiConversation,
  isAiConversationPanelOpen,
}) {
  const Dispatch = useDispatch();
  const socket = useSocket();
  const menuRef = React.useRef(null);
  const [ismenuOpen, setIsMenuOpen] = React.useState(false);
  const [onlineStatus, setOnlineStatus] = React.useState(null);
  const [isOpenAddNewFriendPanel, setIsOpenAddNewFriendPanel] =
    React.useState(false);
  const [isOpenFriendRequestPanel, setIsOpenFriendRequestPanel] =
    React.useState(false);
  const { userDetails } = useSelector((state) => state.User);
  const erroInFriends = useSelector((state) => state.Friends.error);
  const errorInBlockList = useSelector((state) => state.Block.error);
  const { incomingRequests } = useSelector((state) => state.Requests);
  const { selectedConversation } = useSelector((state) => state.Conversations);
  const handleMenuOpen = () => {
    setIsMenuOpen(true);
  };

  const handleOpenAddNewFriendPanel = () => {
    setIsOpenAddNewFriendPanel(!isOpenAddNewFriendPanel);
  };
  const handleOpenFriendRequestPanel = () => {
    setIsOpenFriendRequestPanel(!isOpenFriendRequestPanel);
  };

  const addNewFriendCompo = React.useMemo(() => {
    if (isOpenAddNewFriendPanel) {
      return (
        <AddNewFriend
          isOpenAddNewFriendPanel={isOpenAddNewFriendPanel}
          handleOpenAddNewFriendPanel={handleOpenAddNewFriendPanel}
        />
      );
    } else {
      return <></>;
    }
  }, [isOpenAddNewFriendPanel]);

  const friendRequestPanel = React.useMemo(() => {
    if (isOpenFriendRequestPanel) {
      return (
        <FriendRequest
          isOpenFriendRequestPanel={isOpenFriendRequestPanel}
          handleOpenFriendRequestPanel={handleOpenFriendRequestPanel}
        />
      );
    } else {
      return;
    }
  }, [isOpenFriendRequestPanel]);

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  React.useEffect(() => {
    Dispatch(handleToGetRequestsAPI());
    Dispatch(handleToGetNotificationAPI());
    Dispatch(handleGetFriendListOnlyIdsAPI());
    Dispatch(handleGetBlockListAPI());
    Dispatch(handleToGetLastMessagesAPI());
    Dispatch(handleGetWhoBlockMeAPI());
  }, [Dispatch]);

  React.useEffect(() => {
    const handleAddMessage = (data) => {
      if (
        selectedConversation &&
        selectedConversation.userInfo._id === data.senderId
      ) {
        Dispatch(handleToAddRealTimeMessage(data));
        Dispatch(
          handleToAddLastMessage({
            receiverId: data.senderId,
            message: data.message,
            fileType: data.fileType,
            createdAt: data.createdAt,
          })
        );
      } else {
        Dispatch(handleToAddNotificationAPI(data));
        Dispatch(
          handleToAddLastMessage({
            receiverId: data.senderId,
            message: data.message,
            fileType: data.fileType,
            createdAt: data.createdAt,
          })
        );
        toast.info("New Messaga!!");
      }
    };
    socket?.on("sendMessageOrFileInRealTime", handleAddMessage);
    return () => {
      socket?.off("sendMessageOrFileInRealTime", handleAddMessage);
    };
  }, [socket, selectedConversation]);

  React.useEffect(() => {
    if (erroInFriends) {
      toast.error(erroInFriends);
      Dispatch(handleToClearErrorForFriends());
    }
    if (errorInBlockList) {
      toast.error(errorInBlockList);
      Dispatch(handleToClearErrorForBlockList());
    }
  }, [erroInFriends, errorInBlockList, Dispatch]);

  React.useEffect(() => {
    if (onlineStatus === "Active") {
      socket?.emit("activeUser", {
        userId: userDetails._id,
      });
    } else if (onlineStatus === "Inactive") {
      socket?.emit("deActiveUser", {
        userId: userDetails._id,
      });
    }
  }, [onlineStatus]);

  return (
    <>
      <div
        className={`w-full h-full relative md:w-[40%] lg:w-[30%]  text-black bg-gray-50 `}
      >
        <div className="w-full p-5 flex  justify-between items-center  relative ">
          <button
            className=" text-3xl text-black hover:bg-[#71f1a6] cursor-pointer  duration-500 p-1 rounded-full"
            onClick={handleLeftSidebarOpen}
          >
            <CiMenuKebab />
          </button>
          <div className=" flex gap-2 items-center ">
            <img
              src={userDetails && userDetails.profilePhoto.url}
              alt="me"
              className="w-16 h-16 rounded-full"
            />
            <div className=" flex  flex-col  ">
              <span className=" text-xl font-semibold">
                {userDetails && userDetails.fullName}
              </span>
              <div className=" flex items-center  gap-2">
                <span className=" font-thin text-lg text-green-400">
                  {userDetails?.onlineShow === true || onlineStatus !== null
                    ? onlineStatus || "Active"
                    : "Inactive"}
                </span>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setOnlineStatus("Active");
                    } else {
                      setOnlineStatus("Inactive");
                    }
                  }}
                  defaultChecked={userDetails?.onlineShow}
                  className="toggle toggle-accent bg-green-400"
                />
              </div>
            </div>
          </div>
          <div>
            <button
              className=" text-4xl  text-black relative cursor-pointer hover:bg-[#71f1a6]  duration-500 p-1 rounded-full"
              onClick={handleMenuOpen}
            >
              <IoIosAddCircleOutline />
              {incomingRequests.length !== 0 && (
                <GoDotFill className=" absolute top-0 left-5 text-red-500 text-lg  " />
              )}
            </button>
          </div>
          <div
            ref={menuRef}
            className={`absolute top-[70%] right-3 shadow-xl shadow-black rounded-md z-50 bg-white p-1 
                transition-all duration-300 transform scale-0 opacity-0 
                ${ismenuOpen ? "scale-100 opacity-100" : ""}`}
          >
            <ul className="text-lg">
              <li
                className=" m-3 hover:text-xl   hover:shadow-xl  p-1  rounded-md  duration-500 cursor-pointer"
                onClick={handleOpenAddNewFriendPanel}
              >
                Add New Friend
              </li>
              <li
                className="  m-3 hover:text-xl   hover:shadow-xl  p-1  relative rounded-md duration-500 cursor-pointer"
                onClick={handleOpenFriendRequestPanel}
              >
                Friend requests
                {incomingRequests.length !== 0 && (
                  // <GoDotFill className=" absolute top-0  right-0 text-red-500 text-lg  " />
                  <span className=" absolute   top-0  right-0 text-white rounded-full p-1 animate-ping bg-red-500">
                    {incomingRequests.length >= 100
                      ? "100+"
                      : incomingRequests.length}
                  </span>
                )}
              </li>
            </ul>
          </div>
        </div>
        <hr />
        <div className=" w-full  h-full overflow-auto hiddenScrollbar">
          <div className=" w-full  flex flex-col ">
            <div className=" w-full h-full">
              <Suspense fallback={<LoaderCompo />}>
                <ConversationList />
              </Suspense>
            </div>
          </div>
        </div>
        {addNewFriendCompo}
        {friendRequestPanel}

        {!isAiConversationPanelOpen && (
          <button
            className=" rounded-full  bg-green-300 absolute bottom-6  cursor-pointer right-4 animate-bounce"
            onClick={handleToAiConversation}
          >
            <img src="aiPhoto.png" alt="logo" className="w-13 h-13" />
          </button>
        )}
      </div>
    </>
  );
}

export default ChatDeshBoard;
