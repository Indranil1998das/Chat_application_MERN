import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoMdFemale } from "react-icons/io";
import { IoMdMale } from "react-icons/io";
import ShowFriendList from "./ShowFriendList";
import ChangePassword from "./ChangePassword";
import LoaderCompo from "./LoaderCompo";
import useSocket from "../context/useContext";
import { handleChangeProfilePhotoAPI } from "../slices/UserSlice";
function UserInfo({ handleUserInfoClose, isUserInfoOpen }) {
  const Dispatch = useDispatch();
  const socket = useSocket();
  const { userDetails, isLoading, success_message } = useSelector(
    (state) => state.User
  );
  const [isShowFriendList, setIsShowFriendList] = React.useState(false);
  const [isChagePasswordPanelOpen, setIsChagePasswordPanelOpen] =
    React.useState(false);
  const handleShowFriendList = () => {
    setIsShowFriendList(!isShowFriendList);
  };
  const handleChangePasswordPanel = () => {
    setIsChagePasswordPanelOpen(!isChagePasswordPanelOpen);
  };

  const handleChangePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        Dispatch(handleChangeProfilePhotoAPI(reader.result));
      };
      reader.readAsDataURL(file);
    }
  };
  React.useEffect(() => {
    if (success_message === "Profile photo updated successfully") {
      socket.emit("updateProfilePhoto", {
        userId: userDetails._id,
        profilePhoto: userDetails.profilePhoto,
      });
    }
  }, [success_message]);
  return (
    <div className={`userInfoShowPanelCSS ${isUserInfoOpen ? "active" : ""} `}>
      {isLoading ? (
        <div className=" h-auto w-auto  p-3  rounded-2xl bg-green-500/45  flex flex-col justify-center items-center relative animationCSSRToL active">
          <LoaderCompo />
        </div>
      ) : (
        <>
          {userDetails && !isShowFriendList && !isChagePasswordPanelOpen && (
            <div className=" w-auto  h-auto  p-3   bg-white shadow-xl rounded-lg flex flex-col justify-center items-center  relative animationCSSRToL active ">
              <div className="  w-full flex justify-end items-center">
                <button
                  className=" p-1 cursor-pointer rounded-full  text-black text-xl  md:text-3xl hover:bg-red-500 duration-500 "
                  onClick={handleUserInfoClose}
                >
                  <IoIosCloseCircleOutline />
                </button>
              </div>
              <div className="relative w-32 h-32 group ">
                <label htmlFor="profilePhoto" className="cursor-pointer">
                  <img
                    src={userDetails.profilePhoto.url || "/images/default.png"}
                    alt="user"
                    className="w-32 h-32 rounded-full border-4 border-green-500 hover:border-green-700  transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white text-sm font-semibold opacity-0 group-hover:opacity-60 transition-all duration-300">
                    Change Photo
                  </div>
                </label>
                <input
                  type="file"
                  className="hidden"
                  id="profilePhoto"
                  accept="image/jpeg"
                  onChange={handleChangePhoto}
                />
              </div>
              <h1 className=" text-2xl font-bold  text-green-500 ">
                {userDetails.fullName}
              </h1>
              <p className=" text-gray-600">{userDetails.userEmail}</p>
              <p className=" text-red-400 text-4xl ">
                {userDetails.gender === "female" ? (
                  <IoMdFemale />
                ) : (
                  <IoMdMale />
                )}
              </p>
              <button
                className=" text-green-300 hover:text-green-700  cursor-pointer  font-semibold  duration-500"
                onClick={handleShowFriendList}
              >
                See FriendList
              </button>
              <button
                className=" text-red-600 hover:text-red-700  cursor-pointer  duration-500"
                onClick={handleChangePasswordPanel}
              >
                Change Password
              </button>
            </div>
          )}
          {isShowFriendList && (
            <ShowFriendList handleShowFriendList={handleShowFriendList} />
          )}
          {isChagePasswordPanelOpen && (
            <ChangePassword
              handleChangePasswordPanel={handleChangePasswordPanel}
            />
          )}
        </>
      )}
    </div>
  );
}

export default React.memo(UserInfo);
