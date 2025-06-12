import { IoMdPersonAdd } from "react-icons/io";
import { RiUserUnfollowLine } from "react-icons/ri";
import { useSelector } from "react-redux";

function OtherFriendSummary({
  data,
  handleTosendRequest,
  handleToCancelRequest,
  sentRequests,
  handleToOtherUserInfoOpen,
}) {
  const { usersWhoBlockedMe } = useSelector((state) => state.Block);
  const { basicFriendList } = useSelector((state) => state.Friends);
  const { incomingRequests } = useSelector((state) => state.Requests);
  return (
    <div className="text-lg m-2 flex items-center  justify-between p-2  cursor-pointer hover:bg-green-400/10  rounded-md duration-500 shadow-xl">
      <div onClick={() => handleToOtherUserInfoOpen(data)}>
        <div>
          <img
            src={data.profilePhoto.url}
            alt="abc"
            className=" w-11 h-11 rounded-full"
          />
        </div>
        <div>
          <h1 className="text-lg font-semibold ">
            {data.fullName.split(" ")[0]}
          </h1>
          <span className=" text-sm">
            {data.userEmail.length >= 20
              ? `${data.userEmail.substr(0, 20)}....`
              : data.userEmail}
          </span>
        </div>
      </div>
      {!usersWhoBlockedMe.some((user) => user._id === data._id) && (
        <div className="">
          {!incomingRequests.some((i) => i.senderInfo._id === data._id) && (
            <>
              {basicFriendList.some((id) => id === data._id) ? (
                <p className=" font-semibold text-lg">Friend</p>
              ) : (
                <>
                  {sentRequests.includes(data._id) ? (
                    <button
                      className="p-1 text-[7vmin] cursor-pointer sm:text-[5vmin] hover:text-[6vmin] duration-500"
                      onClick={() => handleToCancelRequest(data._id)}
                    >
                      <RiUserUnfollowLine />
                    </button>
                  ) : (
                    <button
                      className="p-1 text-[7vmin]  cursor-pointer sm:text-[5vmin] hover:text-[6vmin] duration-500"
                      onClick={() => handleTosendRequest(data._id)}
                    >
                      <IoMdPersonAdd />
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default OtherFriendSummary;
