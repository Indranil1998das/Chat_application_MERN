import React from "react";
import { useSelector } from "react-redux";
import AiMessage from "./AiMessage";
import { v4 as uuidv4 } from "uuid";
function AiMessages() {
  const { aiMessages } = useSelector((state) => state.AiMessages);
  const containerRef = React.useRef(null);
  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [aiMessages]);
  return (
    <div
      className="w-full overflow-auto p-2 hiddenScrollbar flex flex-col gap-2 h-[80%]"
      ref={containerRef}
    >
      {aiMessages.map((data) => (
        <AiMessage data={data} key={uuidv4()} />
      ))}
    </div>
  );
}

export default AiMessages;
