import React from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import LoaderCompo from "./LoaderCompo";
import { handleGetFriendListAPI } from "../slices/FriendsSlice";
export default function ShowFriendList({ handleShowFriendList }) {
  const Dispatch = useDispatch();
  const { isloading, fullFriendProfiles } = useSelector(
    (state) => state.Friends
  );
  React.useEffect(() => {
    Dispatch(handleGetFriendListAPI());
  }, [Dispatch]);
  return (
    <div className=" w-auto  h-[60%] p-3   bg-white shadow-xl rounded-lg flex flex-col justify-center items-center  relative animationCSSRToL active ">
      {isloading ? (
        <LoaderCompo />
      ) : (
        <>
          <div className="w-full flex justify-between items-center ">
            <h1 className="text-2xl font-bold text-center  text-green-300">
              Friend List
            </h1>
            <button
              className=" p-1 cursor-pointer rounded-full  text-black text-xl  md:text-3xl hover:bg-red-500 duration-500 "
              onClick={handleShowFriendList}
            >
              <IoIosCloseCircleOutline />
            </button>
          </div>

          <div className="flex flex-col items-center overflow-auto h-full w-full hiddenScrollbar">
            {fullFriendProfiles.length > 0 ? (
              fullFriendProfiles.map((friend) => (
                <div
                  key={friend._id}
                  className="w-full p-2 border-b border-gray-200 rounded-md hover:bg-gray-100 transition duration-300 mb-2"
                >
                  <div className="flex items-center">
                    <img
                      src={friend.profilePhoto.url}
                      alt={friend.fullName}
                      className="w-20 h-20 rounded-full mr-3"
                    />
                    <div>
                      <h2 className="text-lg  text-green-300/90">
                        {friend.fullName}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {friend.userEmail}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No friends found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
