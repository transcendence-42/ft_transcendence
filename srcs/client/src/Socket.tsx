import { io } from "socket.io-client";

export const ChatSocket = io(process.env.REACT_APP_CHAT_SOCKET_URL as string, {
  withCredentials: true
  // autoConnect: false,
});

