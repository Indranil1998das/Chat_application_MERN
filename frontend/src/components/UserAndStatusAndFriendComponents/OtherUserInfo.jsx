import React from "react";
import { IoMdFemale } from "react-icons/io";
import { IoMdMale } from "react-icons/io";
import { IoIosCloseCircleOutline } from "react-icons/io";
function OtherUserInfo({ data, handleToOtherUserInfoClose }) {
  return (
    <div className="userInfoShowPanelCSS active">
      {data && (
        <div className=" w-auto  h-auto   p-3   bg-white shadow-xl rounded-lg flex flex-col justify-center items-center relative">
          <button
            className=" absolute top-0 m-2 right-0 p-1 cursor-pointer rounded-full  text-black text-xl  md:text-3xl hover:bg-red-500 duration-500  "
            onClick={handleToOtherUserInfoClose}
          >
            <IoIosCloseCircleOutline />
          </button>
          <img
            src={data.profilePhoto.url || "/images/default.png"}
            alt="user"
            className=" w-32 h-32 rounded-full border-4 border-green-500"
          />
          <h1 className=" text-2xl font-bold  text-green-500 ">
            {data.fullName}
          </h1>
          <p className=" text-gray-600">{data.userEmail}</p>
          <p className=" text-red-400 text-4xl ">
            {data.gender === "female" ? <IoMdFemale /> : <IoMdMale />}
          </p>
        </div>
      )}
    </div>
  );
}

export default OtherUserInfo;
