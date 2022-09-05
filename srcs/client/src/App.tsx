import {SocketContext, socket} from './socket';
import React from 'react';
import './App.css';
import GameLobby from './components/GameLobby';

const App = () => {
  return (
      <SocketContext.Provider value={socket}>
        <div className="App">
          <GameLobby />
        </div>
      </SocketContext.Provider>
  );
}

export default App;