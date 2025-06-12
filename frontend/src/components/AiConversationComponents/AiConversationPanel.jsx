import HeaderOfAiConversation from "./HeaderOfAiConversation";
import AiMessageWrite from "./AiMessageWrite";
import AiMessages from "./AiMessages";
function AiConversationPanel({ handleToAiConversation }) {
  return (
    <div className=" h-full w-full  md:w-[60%] lg:w-[70%]  absolute md:sticky  z-50 md:z-0 flex flex-col items-center justify-center text-black  animationCSSRToL active backgroundCss">
      <HeaderOfAiConversation handleToAiConversation={handleToAiConversation} />
      <AiMessages />
      <AiMessageWrite />
    </div>
  );
}

export default AiConversationPanel;
