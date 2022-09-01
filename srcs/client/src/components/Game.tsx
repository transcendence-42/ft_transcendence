import React, { useCallback, useContext, useEffect, useState } from "react";
import { SocketContext } from '../socket';
import { Stage, Layer, Rect, Circle } from 'react-konva';

const Game = () => {
  const socket = useContext(SocketContext);
  const [players, setPlayers] = useState([]);

  const handleConnect = useCallback(() => {
    console.log('connection from client');
  }, []);

  const handleBroadcast = useCallback((data: any) => {
    console.log('Broadcasted : ' + data.message );
    setPlayers(data.clients);
  }, []);
  
  useEffect(() => {
    socket.on('broadcast', handleBroadcast);
    socket.on('connect', handleConnect);
  }, []);

  const playersRect = players.map((player: any, index: number) => <Rect key={player.socketId} width={50} height={50} x={100 * (index + 1)} fill="red" />) 
  
  return (
    <div>
      <Stage width={600} height={600}>
        <Layer name="background">
          <Rect width={600} height={600} fill="blue" />
        </Layer>
        <Layer>
          {playersRect}
        </Layer>
      </Stage>
    </div>
  )
}

export default Game;
