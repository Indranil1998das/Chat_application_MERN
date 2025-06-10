import React from "react";
import { IoIosSend } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  handleToSendMessageToAIAPI,
  handleToaddSendMessage,
  handleToclearErrorAiMessage,
} from "../../slices/AiMessageSlice";
import { toast } from "react-toastify";
function AiMessageWrite() {
  const Dispatch = useDispatch();
  const [message, setMessage] = React.useState("");
  const { userDetails } = useSelector((state) => state.User);
  const { error } = useSelector((state) => state.AiMessages);

  const resetScroll = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 200);
  };
  React.useEffect(() => {
    if (error) {
      toast.error(error);
      Dispatch(handleToclearErrorAiMessage());
      setMessage("");
    }
  }, [error, Dispatch]);
  React.useEffect(() => {
    const initialHeight = window.innerHeight;
    const handleResize = () => {
      if (window.innerHeight === initialHeight) {
        // Keyboard closed
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className=" flex items-center w-full p-4 text-white sm:mb-3">
      <div className="w-full ml-1 mr-1">
        <input
          type="text"
          value={message}
          inputMode="text"
          style={{ fontSize: "16px" }}
          onChange={(e) => setMessage(e.target.value)}
          onBlur={resetScroll}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              if (message.length === 0) {
                toast.info("Please enter a message.");
                return;
              }
              Dispatch(handleToSendMessageToAIAPI(message));
              Dispatch(
                handleToaddSendMessage({
                  name: userDetails.fullName,
                  message: message,
                })
              );
              setMessage("");
            }
          }}
          placeholder="Type here"
          className="input input-bordered p-2 font-normalTextfont rounded-md w-[100%]  shadow-xl shadow-green-500 bg-white/25 focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>
      <button
        className=" p-2 hover:bg-green-300 rounded-full cursor-pointer duration-500"
        onClick={() => {
          if (message.length === 0) {
            toast.info("Please enter a message.");
            return;
          }
          Dispatch(handleToSendMessageToAIAPI(message));
          Dispatch(
            handleToaddSendMessage({
              name: userDetails.fullName,
              message: message,
            })
          );
          setMessage("");
        }}
      >
        <IoIosSend className="text-3xl" />
      </button>
    </div>
  );
}

export default AiMessageWrite;
