import { io } from 'socket.io-client';

export const socket = io(process.env.REACT_APP_CHAT_SOCKET_URL as string, {
  withCredentials: true
});
