import React from 'react';
import { io, Socket } from 'socket.io-client';

const socket = io(process.env.REACT_APP_GAME_SOCKET_URL as string, {
  autoConnect: false
});

export const GameSocketContext = React.createContext(socket as Socket);

const GameSocketProvider = (props: any) => {
  return (
    <GameSocketContext.Provider value={socket}>
      {props.children}
    </GameSocketContext.Provider>
  );
};

export default GameSocketProvider;
