import React, { useEffect, useState } from 'react';
import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './Pages/Home/home';
import Profile from './Pages/Profile/Profile';
import Notfound from './Pages/NotFound/notFound';
import Login from './Pages/Login/Login';
import About from './Pages/About/about';
import Leaderboard from './Pages/Leaderboard/leaderboard';
import Chat from './Pages/Chat/chat';
import NavBar from './Components/Tools/NavBar/NavBar';
import AuthenticatedRoute from './Components/services/authenticatedRoute';
import MapChoice from './Pages/MapChoice/mapChoice';
import Matchmaking from './Pages/Matchmaking/matchmaking';
import Context from './Context/Context';
import GameLobby from './Pages/Game/GameLobby';
import FakeProfile from './Pages/tmpProfile/FakeProfile';
import RootModals from './Pages/RootModals/RootModals';
import RootModalsProvider from './Pages/RootModals/RootModalsProvider';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isFromAuth, setIsFromAuth] = useState(false);

  /*
   ** Context is init here to spread it on all routes. Is connected to be sure that the user is connected
   ** isFromAuth is to be sure that the user has been through the 42 Auth
   */
  const contextValue = {
    isConnected: isConnected,
    isFromAuth: isFromAuth,
    updateIsConnected: setIsConnected,
    updateIsFromAuth: setIsFromAuth,
  };

  /*
   ** Check if the user is still connected, it is working here from root for all routes
   */
  useEffect(() => {
    var data = localStorage.getItem('pathIsFree');
    if (data) {
      contextValue.updateIsConnected(true);
    } else contextValue.updateIsConnected(false);
  });

  /*
   ** Context.Provider surround all routes and spread the contextValue, BrowserRouter allows us to use routes.
   ** Routes surround all route
   */
  return (
    <Context.Provider value={contextValue}>
      <RootModalsProvider>
        <BrowserRouter>
          <div className="main">
            <NavBar />
            <RootModals />
              <Routes>
                <Route path="*" element={<Notfound />} />
                <Route index element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/lobby" element={<GameLobby/>} />
                <Route path="/prof" element={<FakeProfile />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/home" element={<Home />} />
                <Route path="/" element={<AuthenticatedRoute res />}>
                  <Route path="/about" element={<About />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/mapchoice" element={<MapChoice />} />
                  <Route path="/matchmaking" element={<Matchmaking />} />
                </Route>
              </Routes>
          </div>
        </BrowserRouter>
      </RootModalsProvider>
    </Context.Provider>
  );
}

export default App;
