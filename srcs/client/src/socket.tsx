import React from 'react';
import { io, Socket } from 'socket.io-client';

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

const userId = getRandomInt(42);

const socket = io(process.env.REACT_APP_GAME_SOCKET_URL as string, {
  query: {
    userId: userId,
    pic: 'https://static.vecteezy.com/ti/vecteur-libre/p1/1991212-avatar-profile-pink-neon-icon-brick-wall-background-color-neon-vector-icon-vectoriel.jpg',
    name: 'twagner',
  },
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