import React from "react";
import { socketContext } from "./SocketContext";
function useSocket() {
  return React.useContext(socketContext);
}

export default useSocket;
