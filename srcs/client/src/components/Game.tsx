import React, { useCallback, useContext, useEffect, useState } from "react";
import { SocketContext } from '../socket';

const Game = () => {
  const socket = useContext(SocketContext);
  const [joined, setJoined] = useState(false);

  const handleInviteAccepted = useCallback(() => {
    setJoined(true);
  }, []);

  const handleJoinChat = useCallback(() => {
    socket.emit("SEND_JOIN_REQUEST");
  }, []);

  useEffect(() => {
    socket.emit("USER_ONLINE", "toto"); 
    socket.on("JOIN_REQUEST_ACCEPTED", handleInviteAccepted); 
    socket.on("WELCOME", () => console.log('welcome'));
    return () => {
      // before the component is destroyed
      socket.off("JOIN_REQUEST_ACCEPTED", handleInviteAccepted);
    };
  }, [socket, handleInviteAccepted]);

  return (
    <div>
      {
        joined
        ? <h1>joined</h1>
        : <h1>not joined</h1>
      }
      <button onClick={handleJoinChat}>
        Join Chat
      </button>
    </div>
  )
}

export default Game;
