import React from "react";
import { useSelector } from "react-redux";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoMdFemale } from "react-icons/io";
import { IoMdMale } from "react-icons/io";
function ConverstionInfo({ handleToCloseConversationInfo }) {
  const { selectedConversation } = useSelector((state) => state.Conversations);
  return (
    <div className={`userInfoShowPanelCSS active `}>
      <div className=" w-auto h-auto   p-2 md:w-[50%]  bg-white shadow-lg rounded-lg flex flex-col justify-center items-center  relative">
        <button
          className=" absolute top-0 m-2 right-0 p-1 cursor-pointer rounded-full  text-black text-xl  md:text-3xl hover:bg-red-500 duration-500  "
          onClick={handleToCloseConversationInfo}
        >
          <IoIosCloseCircleOutline />
        </button>
        <img
          src={
            selectedConversation &&
            selectedConversation.userInfo.profilePhoto.url
              ? selectedConversation.userInfo.profilePhoto.url
              : "/images/default.png"
          }
          alt="user"
          className=" w-32 h-32 rounded-full border-4 border-green-500"
        />
        <h1 className=" text-2xl font-bold  text-green-500 ">
          {selectedConversation && selectedConversation.userInfo.fullName}
        </h1>
        <p className=" text-gray-600">
          {selectedConversation && selectedConversation.userInfo.userEmail}
        </p>
        <p className=" text-red-400 text-4xl ">
          {selectedConversation && selectedConversation.gender === "female" ? (
            <IoMdFemale />
          ) : (
            <IoMdMale />
          )}
        </p>
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-lg font-bold text-green-500">Conversation</h2>
          <div className=" flex flex-col items-center justify-center">
            <div className=" flex items-center gap-2">
              <span className="  text-green-400 font-semibold">Id:</span>
              <p className="text-gray-500">
                {selectedConversation && selectedConversation.conversationId}
              </p>
            </div>
            <div className=" flex items-center gap-2">
              <span className=" font-semibold text-green-400">Created At:</span>
              <p className="text-gray-500">
                {selectedConversation &&
                  new Date(selectedConversation.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConverstionInfo;
