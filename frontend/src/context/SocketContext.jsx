import React from "react";
import { io } from "socket.io-client";
const socketContext = React.createContext();
export function SocketProvider({ children }) {
  const [socket, setSocket] = React.useState(null);
  React.useEffect(() => {
    const socketInstance = io(import.meta.env.VITE_BACKEND_SERVER, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 3000,
      pingInterval: 25000,
      pingTimeout: 60000,
    });
    setSocket(socketInstance);
    return () => socketInstance.close();
  }, []);
  return (
    <socketContext.Provider value={socket}>{children}</socketContext.Provider>
  );
}

export { socketContext };
