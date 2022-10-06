import React from 'react';
import { io } from 'socket.io-client';
import { mockUsers } from './mockUsers';


function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

const userId = getRandomInt(40);
const socket = io(process.env.REACT_APP_GAME_SOCKET_URL as string, {
  query: {
    userId: userId,
    pic: mockUsers[userId].pic,
    name: mockUsers[userId].name,
  },
  path: '/api/gamews/socket.io',
  transports: ["websocket", "polling"]
});

export const SocketContext = React.createContext([socket, userId] as any);

const GameSocketProvider = (props: any) => {
  return (
    <SocketContext.Provider value={[socket, userId]}>
      {props.children}
    </SocketContext.Provider>
  );
};

export default GameSocketProvider;
