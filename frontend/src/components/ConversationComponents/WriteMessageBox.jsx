import React from "react";
import { IoIosSend } from "react-icons/io";
import { CiCirclePlus } from "react-icons/ci";
import { IoImage } from "react-icons/io5";
import { RiFileVideoLine } from "react-icons/ri";
import { toast } from "react-toastify";
import useSocket from "../../context/useContext";
import { useSelector, useDispatch } from "react-redux";
import {
  handleToSendMessageAPI,
  handleToGetUploadUrlForFilesAPI,
  handleToClearRecentStates,
  handleToAddLastMessage,
} from "../../slices/MessageSlice";
import SendFile from "./SendFile";

function WriteMessageBox() {
  const menuRef = React.useRef(null);
  const fileInputRef = React.useRef(null);
  const socket = useSocket();
  const Dispatch = useDispatch();
  const { selectedConversation } = useSelector((state) => state.Conversations);
  const { recentSendingMessage } = useSelector((state) => state.Messages);
  const [isOpenFilesSendMenu, setIsOpenFilesSendMenu] = React.useState(false);
  const [isFilePreviewPanel, setIsFilePreviewPanel] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [image, setImage] = React.useState(null);
  const [video, setVideo] = React.useState(null);
  const [imagePreview, setImagePreview] = React.useState(null);
  const [videoPreview, setVideoPreview] = React.useState(null);

  const handleOpenFilesSendMenu = () => {
    setIsOpenFilesSendMenu(!isOpenFilesSendMenu);
  };

  const handleToSendFilePreviewOpen = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const fileName = file.name;
    const fileType = e.target.id;
    const reader = new FileReader();
    reader.onload = () => {
      if (fileType === "image") {
        setImagePreview(reader.result);
        setImage(file);
      } else if (fileType === "video") {
        setVideoPreview(reader.result);
        setVideo(file);
      }
      Dispatch(
        handleToGetUploadUrlForFilesAPI({
          fileName,
          fileType,
        })
      );
    };
    reader.readAsDataURL(file);
    setIsFilePreviewPanel(true);
    e.target.value = null;
    setIsOpenFilesSendMenu(false);
  };

  const resetScroll = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 200);
  };

  React.useEffect(() => {
    if (imagePreview || videoPreview) {
      setIsFilePreviewPanel(true);
    } else {
      setIsFilePreviewPanel(false);
    }
  }, [imagePreview, videoPreview]);

  React.useEffect(() => {
    if (recentSendingMessage) {
      socket?.emit("realTimeMessageOrFileSend", recentSendingMessage);
      Dispatch(handleToAddLastMessage(recentSendingMessage));
      Dispatch(handleToClearRecentStates());
    }
  }, [recentSendingMessage]);

  // Close file send menu when clicked outside
  React.useEffect(() => {
    const handleCloseFilesSendMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpenFilesSendMenu(false);
      }
    };
    document.addEventListener("mousedown", handleCloseFilesSendMenu);
    return () => {
      document.removeEventListener("mousedown", handleCloseFilesSendMenu);
    };
  }, []);

  // Fix for iOS/Android keyboard scroll
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
    <>
      <div className="flex items-center w-full p-4  text-white  sm:mb-3">
        <div ref={menuRef}>
          <button onClick={handleOpenFilesSendMenu}>
            <CiCirclePlus className="text-4xl  cursor-pointer" />
          </button>
          <div
            className={` absolute   bottom-24 left-4 p-3 rounded-md bg-white text-black shadow transition-all duration-300 transform scale-0 opacity-0 cursor-pointer ${
              isOpenFilesSendMenu ? "scale-100 opacity-100" : ""
            }`}
          >
            <ul className="text-xl">
              <li className="flex items-center m-2 gap-2 cursor-pointer hover:font-semibold hover:text-2xl duration-300">
                <IoImage />
                <label htmlFor="image">Image</label>
                <input
                  type="file"
                  accept="image/jpeg"
                  className="hidden"
                  id="image"
                  ref={fileInputRef}
                  onChange={handleToSendFilePreviewOpen}
                />
              </li>
              <li className="flex items-center m-2 gap-2 cursor-pointer hover:font-semibold hover:text-2xl duration-300">
                <RiFileVideoLine />
                <label htmlFor="video">Video</label>
                <input
                  type="file"
                  accept="video/mp4"
                  className="hidden"
                  id="video"
                  onChange={handleToSendFilePreviewOpen}
                />
              </li>
            </ul>
          </div>
        </div>

        <div className="w-full ml-1 mr-1">
          <input
            type="text"
            value={message}
            inputMode="text"
            style={{ fontSize: "16px" }}
            onChange={(e) => setMessage(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                if (message.length === 0) {
                  toast.info("Please enter a message.");
                  return;
                }
                Dispatch(
                  handleToSendMessageAPI({
                    id: selectedConversation.userInfo._id,
                    message: message,
                  })
                );
                setMessage("");
              }
            }}
            onBlur={resetScroll}
            placeholder="Type here"
            className="input input-bordered p-2 font-normalTextfont rounded-md w-full shadow-xl shadow-green-500 bg-white/25 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        <button
          className="p-1 bg-green-400/90 rounded-full   cursor-pointer duration-500"
          onClick={() => {
            if (message.length === 0) {
              toast.info("Please enter a message.");
              return;
            }
            Dispatch(
              handleToSendMessageAPI({
                id: selectedConversation.userInfo._id,
                message: message,
              })
            );
            setMessage("");
          }}
        >
          <IoIosSend className="text-3xl" />
        </button>
      </div>

      <SendFile
        image={image}
        setImage={setImage}
        video={video}
        setVideo={setVideo}
        imagePreview={imagePreview}
        videoPreview={videoPreview}
        isFilePreviewPanel={isFilePreviewPanel}
        setImagePreview={setImagePreview}
        setVideoPreview={setVideoPreview}
      />
    </>
  );
}

export default WriteMessageBox;
