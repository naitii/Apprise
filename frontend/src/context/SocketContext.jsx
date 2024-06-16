/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/user.atom";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const user = useRecoilValue(userAtom);

  useEffect(() => {
    if (user?._id) {
      const socketInstance = io("http://localhost:5222", {
        query: {
          userId: user._id,
        },
      });
      console.log("Socket connected", socketInstance);
      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
        console.log("Socket disconnected");
      };
    }
  }, [user?._id]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
