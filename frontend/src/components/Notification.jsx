import React from "react";
import { IoClose } from "react-icons/io5";
function Notification({ isNotificationPanelOpen, handleToOpenNotification }) {
  return (
    <div
      className={`w-full h-full  md:w-[40%] lg:w-[30%] absolute top-0 bg-white z-50 px-3 pt-2 transition-all duration-300 transform scale-0 opacity-0 ${
        isNotificationPanelOpen ? "scale-100 opacity-100" : ""
      }`}
    >
      <div className=" flex justify-between items-center mb-5">
        <h1 className=" font-bold text-3xl ">Notifications</h1>
        <button
          className=" text-[8vmin] sm:text-[5vmin] p-1  cursor-pointer hover:bg-green-300 rounded-full duration-500"
          onClick={handleToOpenNotification}
        >
          <IoClose />
        </button>
      </div>
      <div></div>
    </div>
  );
}

export default Notification;
