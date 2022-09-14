import { io } from 'socket.io-client';
import { createContext } from 'react';

export const socket = io(process.env.REACT_APP_CHAT_SOCKET_URL as string, {
  withCredentials: true
});
export const socketContext = createContext(socket);

console.log('Thsi is socket url ', process.env.REACT_APP_CHAT_SOCKET_URL);
