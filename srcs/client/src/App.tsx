import React, { createContext, useContext, useEffect, useState } from 'react';
import './App.css';
import {Routes, Route, BrowserRouter} from 'react-router-dom';

import Home from './Pages/Home/home'
import Profile from './Pages/Profile/Profile'
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
import { Cookies, useCookies } from 'react-cookie';




function App() {
  
  
  const [isConnected, setIsConnected] = useState(false);
  const [isFromAuth, setIsFromAuth] = useState(false);

  const contextValue = {
    isConnected: isConnected,
    isFromAuth: isFromAuth,
    updateIsConnected : setIsConnected,
    updateIsFromAuth : setIsFromAuth
  }


  // const readCookie = () => 
  // {
  //   console.log("Reconnecté");
  //   console.log(getCookies());
  //   console.log("Reconnecté:");
 
  

  //   const user = Cookies.get("auth_session");
  //   if (user)
  //   {
  //    console.log("Reconnecté pour de bon")
  //   }
  // }
  // useEffect(() => {
  //   readCookie();
  // },[])
  
  useEffect(() => {
    var data = localStorage.getItem("pathIsFree");
    if (data)
    {
      contextValue.updateIsConnected(true); 
    }
    else
      contextValue.updateIsConnected(false);
  }, );
 
  



  return (
    <Context.Provider value={contextValue}>
    <BrowserRouter>
        <div className="main">
          <NavBar />
            <Routes>
            <Route path="*" element={<Notfound />} />
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            < Route path="/leaderboard" element={<Leaderboard />} />
            <Route  path='/'element={<AuthenticatedRoute res/>}>
              < Route path="/home" element={<Home />} />
              < Route path="/about" element={<About />} />
              < Route path="/chat" element={<Chat />} />
              < Route path="/profile" element={<Profile />} />
              < Route path="/mapchoice" element={<MapChoice />} />
              < Route path="/matchmaking" element={<Matchmaking />} />
            </Route>
          </Routes>
        </div>
      </ BrowserRouter>
      </Context.Provider>
  );
}

export default App;
