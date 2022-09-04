import React from "react";
import { io } from "socket.io-client";

export const socket = io(
  process.env.REACT_APP_GAME_SOCKET_URL as string,
  { query: { userId: 42 } }
);
export const SocketContext = React.createContext(socket);
