import React from "react";
import { io } from "socket.io-client";

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export const socket = io(
  process.env.REACT_APP_GAME_SOCKET_URL as string,
  { query: { userId: getRandomInt(42) } }
);
export const SocketContext = React.createContext(socket);
