import React from "react";
import { useSelector } from "react-redux";
import LoaderCompo from "../../components/LoaderCompo";
import Message from "./Message";
import { v4 as uuidv4 } from "uuid";
function MessageList() {
  const { isLoadingForGetMessages, getMessagesOrFile } = useSelector(
    (state) => state.Messages
  );
  const containerRef = React.useRef(null);
  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [getMessagesOrFile]);
  return (
    <>
      {isLoadingForGetMessages ? (
        <LoaderCompo />
      ) : (
        <div
          className="w-full overflow-auto p-2 hiddenScrollbar flex-1 flex-col gap-2 h-[80%]"
          ref={containerRef}
        >
          {getMessagesOrFile.map((data) => (
            <Message data={data} key={uuidv4()} />
          ))}
        </div>
      )}
    </>
  );
}

export default MessageList;
