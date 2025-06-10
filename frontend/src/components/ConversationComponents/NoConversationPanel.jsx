import React from "react";

function NoConversationPanel() {
  return (
    <div className=" h-full md:w-[60%] lg:w-[70%] text-black hidden  md:flex animationCSSRToL active  ">
      <div className=" w-full h-full flex items-center justify-center">
        <h1 className=" text-xl font-bold text-white/70">
          Select a conversation to start chatting
        </h1>
      </div>
    </div>
  );
}

export default NoConversationPanel;
