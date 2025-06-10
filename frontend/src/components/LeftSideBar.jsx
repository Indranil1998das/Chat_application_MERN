import React from "react";
import { VscAccount } from "react-icons/vsc";
import { TbLogout } from "react-icons/tb";
import { handleLogoutAPI } from "../slices/UserSlice";
import { useDispatch } from "react-redux";
import useSocket from "../context/useContext";
function LeftSideBar({ menuRef, isLeftSidebarOpen, handleUserInfoOpen }) {
  const Dispatch = useDispatch();
  const socket = useSocket();
  const handleToLogout = () => {
    Dispatch(handleLogoutAPI());
    socket?.emit("logoutUser");
  };
  return (
    <div
      className={`sideMenu ${isLeftSidebarOpen ? "active" : ""}`}
      ref={menuRef}
    >
      <div className=" p-1">
        <img src="logo.png" alt="logo" className="w-[15vmin] h-[15vmin]" />
      </div>
      <hr />
      <div className="h-full flex justify-center">
        <ul className="w-full flex  flex-col items-center">
          <li className="w-full m-1">
            <button
              className=" p-3 w-full flex justify-center  rounded-md hover:bg-[#71f1a6] text-4xl  hover:text-black duration-500"
              onClick={handleUserInfoOpen}
            >
              <VscAccount />
            </button>
          </li>
          <li className="w-full m-1">
            <button
              className=" p-1.5 w-full flex justify-center rounded-md hover:bg-[#71f1a6] text-4xl   hover:text-black   duration-500"
              onClick={handleToLogout}
            >
              <TbLogout />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default LeftSideBar;
