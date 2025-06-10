import React from "react";
import { IoIosSend } from "react-icons/io";
import LoaderCompo from "../../components/LoaderCompo";
import { useDispatch, useSelector } from "react-redux";
import {
  handleToSendMessageAPI,
  handleToIsLoading,
  handleToClearRecentStates,
} from "../../slices/MessageSlice";
function SendFile({
  isFilePreviewPanel,
  image,
  video,
  setImage,
  setVideo,
  setImagePreview,
  setVideoPreview,
  imagePreview,
  videoPreview,
}) {
  const Dispatch = useDispatch();
  const { selectedConversation } = useSelector((state) => state.Conversations);
  const { uploadUrlForFiles, filesKey, isLoadingForSendFilesAndMessages } =
    useSelector((state) => state.Messages);

  const handleFileSend = async () => {
    Dispatch(handleToIsLoading());
    let file = null;
    let fileType = null;
    if (imagePreview) {
      file = image;
      fileType = "image";
    }
    if (videoPreview) {
      file = video;
      fileType = "video";
    }
    const res = await fetch(uploadUrlForFiles, {
      method: "PUT",
      body: file,
    });
    if (res.ok) {
      Dispatch(
        handleToSendMessageAPI({
          id: selectedConversation.userInfo._id,
          fileKey: filesKey,
          fileType: fileType,
        })
      );
      setImage(null);
      setVideo(null);
      setImagePreview(null);
      setVideoPreview(null);
    } else {
      console.error("Failed to upload file");
    }
  };
  return (
    <>
      {isLoadingForSendFilesAndMessages ? (
        <div className="absolute top-0 right-0 h-screen w-screen bg-green-400/40 flex items-center justify-center z-50  transition-all duration-300  transform">
          <LoaderCompo />
        </div>
      ) : (
        <div
          className={`absolute top-0 right-0 h-screen w-screen bg-white/90 flex items-center justify-center z-50  transition-all duration-300  transform  ${
            isFilePreviewPanel ? "scale-100 opacity-100" : "  scale-0 opacity-0"
          } `}
        >
          <div className=" h-full w-full flex  flex-col items-center justify-center ">
            <div className="absolute top-0 right-0 p-4">
              <button
                className="bg-red-500 text-white rounded-full  cursor-pointer p-3 font-semibold shadow-lg hover:bg-red-600 transition duration-300"
                onClick={() => {
                  setImage(null);
                  setVideo(null);
                  setVideoPreview(null);
                  setImagePreview(null);
                  Dispatch(handleToClearRecentStates());
                }}
              >
                Close
              </button>
            </div>
            <div className="flex  items-center justify-center w-full h-full p-1 ">
              <div className="w-[90%] h-[40%] sm:w-[40%]  rounded-md shadow-lg">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="image"
                    className="w-full h-full object-contain rounded-md  shadow-lg"
                  />
                )}
                {videoPreview && (
                  <video
                    src={videoPreview}
                    controls
                    muted
                    autoPlay
                    alt="video"
                    className="w-full h-full object-center rounded-md  shadow-lg"
                  />
                )}
              </div>
            </div>
            {uploadUrlForFiles && (
              <button
                className="p-4 hover:bg-green-500 cursor-pointer rounded-full duration-500 bg-green-300 absolute bottom-[15%] right-3 m-4"
                onClick={handleFileSend}
              >
                <IoIosSend className="text-3xl" />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default SendFile;
