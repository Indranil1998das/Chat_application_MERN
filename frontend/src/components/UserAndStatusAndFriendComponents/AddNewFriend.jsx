import React from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import OtherFriendSummary from "./OtherFriendSummary";
import {
  handleToSendRequestAPI,
  handelGetSendingRequestsAPI,
  handleTocancelFriendRequest,
  handleToClearAllUnnecessaryState,
  handleToClearErrrorForRequest,
} from "../../slices/RequestsSlice";
import useSocket from "../../context/useContext";
import OtherUserInfo from "./OtherUserInfo";
import LoaderCompo from "../LoaderCompo";
import {
  handleSearchForOtherUserAPI,
  clearOtherUserError,
} from "../../slices/OtherUserSlice";
function AddNewFriend({
  isOpenAddNewFriendPanel,
  handleOpenAddNewFriendPanel,
}) {
  const Dispatch = useDispatch();
  const socket = useSocket();
  const { userDetails } = useSelector((state) => state.User);
  const {
    sentRequests,
    success_message,
    isLoading,
    lastCancelledRequestUserId,
    error,
  } = useSelector((state) => state.Requests);
  const requestError = useSelector((state) => state.Requests.error);
  const { otherUsers } = useSelector((state) => state.OtherUsers);
  const otherUsersError = useSelector((state) => state.OtherUsers.error);
  const [input, setInput] = React.useState("");
  const [otherUserInfo, setOtherUserInfo] = React.useState(null);
  const [isOtherUserInfoOpen, setIsOtherUserInfoOpen] = React.useState(false);
  console.log(isOtherUserInfoOpen);

  const handleToSetInput = (e) => {
    setInput(e.target.value);
    Dispatch(handleSearchForOtherUserAPI(e.target.value));
  };
  const handleTosendRequest = (id) => {
    Dispatch(handleToSendRequestAPI(id));
  };

  const handleToCancelRequest = (id) => {
    Dispatch(handleTocancelFriendRequest(id));
  };

  const handleToOtherUserInfoOpen = (data) => {
    setIsOtherUserInfoOpen(true);
    setOtherUserInfo(data);
  };
  const handleToOtherUserInfoClose = () => {
    setIsOtherUserInfoOpen(false);
    setOtherUserInfo(null);
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
    Dispatch(handelGetSendingRequestsAPI());
  }, []);

  React.useEffect(() => {
    if (success_message === "Successfully send request") {
      socket?.emit("sendRequest", {
        senderUserId: userDetails._id,
        receiverUserId: sentRequests[sentRequests.length - 1],
      });
    } else if (success_message === "Successfully Cancel request") {
      socket?.emit("cancelRequest", {
        senderUserInfo: userDetails,
        receiverUserId: lastCancelledRequestUserId,
      });
    }
    Dispatch(handleToClearAllUnnecessaryState());
  }, [success_message]);

  React.useEffect(() => {
    if (requestError) {
      toast.error(requestError);
      Dispatch(handleToClearErrrorForRequest());
    }
    if (otherUsersError) {
      toast.error(otherUsersError);
      Dispatch(clearOtherUserError());
    }
  }, [otherUsersError, requestError, Dispatch]);

  return (
    <>
      <div
        className={`w-full h-full absolute top-0 bg-white z-50 p-1 transition-all duration-300 transform scale-0 opacity-0 ${
          isOpenAddNewFriendPanel ? "scale-100 opacity-100" : ""
        }`}
      >
        <div className=" flex justify-between items-center mb-5">
          <h1 className=" font-bold text-3xl ">Add new Friend</h1>
          <button
            className="cursor-pointer hover:bg-green-300 rounded-full duration-500"
            onClick={handleOpenAddNewFriendPanel}
          >
            <IoClose className=" text-2xl" />
          </button>
        </div>
        {isLoading ? (
          <LoaderCompo />
        ) : (
          <>
            <div className=" relative flex items-center ">
              <input
                type="text"
                value={input}
                onChange={handleToSetInput}
                placeholder="Enter the name"
                className="  w-full px-4 py-2 rounded-md  text-xl   shadow focus:outline-none focus:ring-2 focus:ring-green-700 bg-green-200/30"
              />
            </div>
            <div className=" h-full  w-full overflow-auto hiddenScrollbar pb-32 mt-3">
              <>
                {otherUsers.map((data) => (
                  <OtherFriendSummary
                    key={data._id}
                    data={data}
                    sentRequests={sentRequests}
                    handleTosendRequest={handleTosendRequest}
                    handleToCancelRequest={handleToCancelRequest}
                    handleToOtherUserInfoOpen={handleToOtherUserInfoOpen}
                  />
                ))}
              </>
            </div>
          </>
        )}
      </div>
      {otherUserMemo}
    </>
  );
}

export default React.memo(AddNewFriend);
