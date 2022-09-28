import React from "react";
import { io } from "socket.io-client";

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export const GameSocket = io(process.env.REACT_APP_GAME_SOCKET_URL as string, {
  query: {
    userId: getRandomInt(42),
    pic: "https://static.vecteezy.com/ti/vecteur-libre/p1/1991212-avatar-profile-pink-neon-icon-brick-wall-background-color-neon-vector-icon-vectoriel.jpg",
    name: "twagner"
  },
  autoConnect: false
});
export const SocketContext = React.createContext(GameSocket);
