import { io } from "socket.io-client";

export const ChatSocket = io(process.env.REACT_APP_CHAT_SOCKET_URL as string, {
  autoConnect: false,
  path: '/api/chatws/socket.io',
  // transports: ["websocket", "polling"]
});
