import {SocketContext, socket} from './socket';
import React from 'react';
import './App.css';
import Game from './components/Game';

const App = () => {
  return (
    <SocketContext.Provider value={socket}>
      <div className="App">
        <Game />
      </div>
    </SocketContext.Provider>
  );
}

export default App;