import React from "react";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { CiImageOn } from "react-icons/ci";
import { PiFileVideoThin } from "react-icons/pi";
function ConversationSummary({ handleSelectConversation, data, fullData }) {
  const { selectedConversation } = useSelector((state) => state.Conversations);
  const { lastMessage, notificationOfMessage } = useSelector(
    (state) => state.Messages
  );
  const { onlineFriendIds, basicFriendList } = useSelector(
    (state) => state.Friends
  );
  const [lastMessageInNotification, setLastMessageInNotification] =
    React.useState(null);
  const [notificationLength, setNotificationLength] = React.useState(null);
  React.useEffect(() => {
    const noti = notificationOfMessage.filter((i) => i.senderId === data._id);
    setNotificationLength(noti.length);
    setLastMessageInNotification(noti[noti.length - 1]);
  }, [notificationOfMessage]);
  return (
    <div
      className={`flex space-x-4 px-4 py-4 cursor-pointer items-center  duration-500  ${
        selectedConversation && selectedConversation.userInfo._id === data._id
          ? "bg-green-300/60 shadow-xl "
          : "hover:bg-green-300 hover:shadow-xl"
      }`}
      onClick={() => handleSelectConversation(fullData)}
    >
      {basicFriendList.includes(data._id) ? (
        <div
          className={`avatar ${
            onlineFriendIds.includes(data._id)
              ? "avatar-online"
              : "avatar-offline"
          }
         `}
        >
          <div className="w-12 h-12 rounded-full ">
            <img
              src={data && data.profilePhoto && data.profilePhoto.url}
              alt="abc"
            />
          </div>
        </div>
      ) : (
        <div className="avatar w-12 h-12 rounded-3xl ">
          <div className="w-12 h-12 rounded-full ">
            <img
              src={data && data.profilePhoto && data.profilePhoto.url}
              alt="abc"
            />
          </div>
        </div>
      )}

      <div className=" flex flex-col w-full relative">
        <h1 className="text-lg font-semibold">{data.fullName}</h1>
        {lastMessageInNotification ? (
          <>
            <div className=" w-full flex justify-end absolute top-0">
              <span className="p-1.5 rounded-full bg-green-500 font-semibold shadow w-7 h-7 flex items-center justify-center">
                {notificationLength > 20 ? "10+" : notificationLength}
              </span>
            </div>
            <div className=" flex justify-between w-full font-bold">
              {!lastMessageInNotification.fileType ? (
                <span>
                  {lastMessageInNotification.message.length >= 10
                    ? `${lastMessageInNotification.message.substr(0, 10)}...`
                    : lastMessageInNotification.message}
                </span>
              ) : (
                <span>
                  {lastMessageInNotification.fileType === "image" ? (
                    <CiImageOn className="  text-2xl" />
                  ) : (
                    <PiFileVideoThin className="  text-2xl" />
                  )}
                </span>
              )}
              <time className=" opacity-65">
                {new Date(
                  lastMessageInNotification.createdAt
                ).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </time>
            </div>
          </>
        ) : (
          <>
            {lastMessage.map((item) => (
              <div key={uuidv4()}>
                {data._id === item.id && (
                  <div className=" flex justify-between w-full ">
                    {item.lastMessage !== "File" ? (
                      <span>
                        {item.lastMessage.length >= 10
                          ? `${item.lastMessage.substr(0, 10)}...`
                          : item.lastMessage}
                      </span>
                    ) : (
                      <></>
                    )}
                    <span>
                      {item.fileType &&
                        (item.fileType === "image" ? (
                          <CiImageOn className="  text-2xl" />
                        ) : (
                          <PiFileVideoThin className="  text-2xl" />
                        ))}
                    </span>
                    <time className=" opacity-65">
                      {new Date(item.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </time>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default ConversationSummary;
