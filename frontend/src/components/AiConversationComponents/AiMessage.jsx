import { useSelector } from "react-redux";
function AiMessage(data) {
  const { userDetails } = useSelector((state) => state.User);
  return (
    <div className="text-white font-semibold">
      {data.data.name === userDetails.fullName ? (
        <>
          <div className="chat chat-end ">
            <div className="chat-header ">Me</div>
            {
              <div className="chat-bubble bg-[#3ecdab9e]">
                {data.data.message}
              </div>
            }
          </div>
        </>
      ) : (
        <>
          <div className="chat chat-start">
            <div className="chat-header ">AI</div>
            {data.data.message && (
              <div className="chat-bubble bg-[#3ecdab9e]">
                {data.data.message}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AiMessage;
