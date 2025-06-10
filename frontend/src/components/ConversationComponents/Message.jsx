import { useSelector } from "react-redux";
import { IoIosCloudDownload } from "react-icons/io";
function Message({ data }) {
  const { userDetails } = useSelector((state) => state.User);
  const { selectedConversation } = useSelector((state) => state.Conversations);
  const downloadPhoto = async (Url, imageName) => {
    const imageBlob = await fetch(Url).then((res) =>
      res
        .arrayBuffer()
        .then((buffer) => new Blob([buffer], { type: "image/jpeg" }))
    );
    const link = document.createElement("a");
    link.href = URL.createObjectURL(imageBlob);
    link.download = imageName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadVideo = async (Url, videoName) => {
    const imageBlob = await fetch(Url).then((res) =>
      res
        .arrayBuffer()
        .then((buffer) => new Blob([buffer], { type: "video/mp4" }))
    );
    const link = document.createElement("a");
    link.href = URL.createObjectURL(imageBlob);
    link.download = videoName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="text-white font-semibold">
      {userDetails && data.senderId === userDetails._id ? (
        <>
          <div className="chat chat-end ">
            <div className="chat-header gap-3 flex ">
              Me
              <time className=" opacity-65">
                {new Date(data.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            </div>
            {data.message && (
              <div className="chat-bubble bg-[#3ecdab9e] max-w-[75%] px-4 py-2 rounded-lg break-words">
                {data.message}
              </div>
            )}
            {data.fileKey && data.fileType === "image" && (
              <div className=" chat-bubble rounded-lg bg-[#3ecdab9e]">
                <img
                  src={data.fileUrl}
                  alt={data.fileType}
                  className="w-36 h-36 rounded-md object-scale-down"
                />
                <div
                  className="flex items-center justify-end "
                  onClick={() => {
                    downloadPhoto(data.fileUr, userDetails.fullName);
                  }}
                >
                  <IoIosCloudDownload className=" cursor-pointer hover:text-red-600 duration-500" />
                </div>
              </div>
            )}
            {data.fileKey && data.fileType === "video" && (
              <div className=" chat-bubble rounded-lg bg-[#3ecdab9e]">
                <video
                  src={data.fileUrl}
                  alt={data.fileType}
                  className="w-36 h-36 rounded-md object-scale-down"
                />
                <div
                  className="flex items-center justify-end "
                  onClick={() => {
                    downloadVideo(data.fileUrl, userDetails.fullName);
                  }}
                >
                  <IoIosCloudDownload className=" cursor-pointer hover:text-red-600 duration-500" />
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="chat chat-start">
            <div className="chat-header">
              {selectedConversation && selectedConversation.userInfo.fullName}
              <time className="text-xs opacity-50">
                {new Date(data.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            </div>
            {data.message && (
              <div className="chat-bubble bg-[#3ecdab9e] max-w-[75%] px-4 py-2 rounded-lg break-words">
                {data.message}
              </div>
            )}
            {data.fileKey && data.fileType === "image" && (
              <div className=" chat-bubble rounded-lg bg-[#3ecdab9e] p-2">
                <img
                  src={data.fileUrl}
                  alt={data.fileType}
                  className="w-36 h-36 object-scale-down"
                />
                <div
                  className="flex items-center justify-end "
                  onClick={() => {
                    downloadPhoto(
                      data.fileUrl,
                      selectedConversation.userInfo.fullName
                    );
                  }}
                >
                  <IoIosCloudDownload className=" cursor-pointer hover:text-red-600 duration-500" />
                </div>
              </div>
            )}
            {data.fileKey && data.fileType === "video" && (
              <div className=" chat-bubble rounded-lg bg-[#3ecdab9e]">
                <video
                  src={data.fileUrl}
                  alt={data.fileType}
                  className="w-36 h-36 rounded-md object-scale-down"
                />
                <div
                  className="flex items-center justify-end "
                  onClick={() => {
                    downloadVideo(
                      data.fileUrl,
                      selectedConversation.userInfo.fullName
                    );
                  }}
                >
                  <IoIosCloudDownload className=" cursor-pointer hover:text-red-600 duration-500" />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Message;
