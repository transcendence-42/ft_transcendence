import React, { createContext, useContext, useEffect, useState } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/home';
import Profile from './Pages/Profile/Profile';
import Notfound from './Pages/NotFound/notFound';
import Login from './Pages/Login/Login';
import About from './Pages/About/about';
import Leaderboard from './Pages/Leaderboard/leaderboard';
import Chat from './Pages/Chat/chat';
import NavBar from './Components/Tools/NavBar/NavBar';
import Auth from './Components/Context/Auth';
import AuthenticatedRoute from './Components/services/authenticatedRoute';
import MapChoice from './Pages/MapChoice/mapChoice';
import Matchmaking from './Pages/Matchmaking/matchmaking';
import { socketContext, socket } from './Socket';

function App() {
  return (
    <div className="main">
      <NavBar />
      <socketContext.Provider value={socket}>
        <Routes>
          <Route path="*" element={<Notfound />} />
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/" element={<AuthenticatedRoute pathFree />}>
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/mapchoice" element={<MapChoice />} />
            <Route path="/matchmaking" element={<Matchmaking />} />
          </Route>
        </Routes>
      </socketContext.Provider>
    </div>
  );
}

export default App;
