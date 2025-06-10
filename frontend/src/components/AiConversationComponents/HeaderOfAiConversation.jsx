import React from "react";
import { MdClose } from "react-icons/md";
function HeaderOfAiConversation({ handleToAiConversation }) {
  return (
    <div className="w-full p-6 flex justify-between items-center  bg-white  relative">
      <div className="flex space-x-4 items-center ">
        <button
          className=" p-1 text-2xl cursor-pointer"
          onClick={handleToAiConversation}
        >
          <MdClose />
        </button>
        <span className=" font-bold text-xl flex gap-1.5">
          Ai <img src="ai-technology.png" alt="ai logo" className=" w-3 h-3" />
        </span>
      </div>
    </div>
  );
}

export default HeaderOfAiConversation;
