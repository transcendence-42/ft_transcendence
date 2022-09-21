import React, { createContext, useContext, useEffect, useState } from 'react';
import './App.css';
import {Routes, Route} from 'react-router-dom';
import Home from './Pages/Home/home'
import Profile from './Pages/Profile/Profile'
import OtherProfile from './Pages/Profile/OtherProfile'
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


function App() {


  return (
        <div className="main">
          <NavBar />
            <Routes>
            <Route path="*" element={<Notfound />} />
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            < Route path="/leaderboard" element={<Leaderboard />} />
              < Route path="/profile" element={<Profile />} />
              < Route path="/other_profile" element={<OtherProfile />} />
            <Route  path='/'element={<AuthenticatedRoute pathFree/>}>
              < Route path="/home" element={<Home />} />
              < Route path="/about" element={<About />} />
              < Route path="/chat" element={<Chat />} />
              < Route path="/mapchoice" element={<MapChoice />} />
              < Route path="/matchmaking" element={<Matchmaking />} />
            </Route>
          </Routes>
        </div>
  );
}

export default App;


// <div className="main">
// <NavBar />
//   <Routes>
//   <Route path="/" element={<Home />} />
//   <Route path="*" element={<Notfound />} />
//   <Route  path='/' element={<AuthenticatedRoute setIsAuthenticated/>}>
//     < Route path="/profile/:id" element={<Profile />} />
//   </Route>
// </Routes>
// </div>

        //  <NavBar />
        //     <Routes>
        //     <Route path="/" element={<Home />} />
        //     <Route path="*" element={<Notfound />} />
        //     <Route  path='/' element={<AuthenticatedRoute/>}>
        //       < Route path="/profile/:id" element={<Profile />} />
        //     </Route>
        //   </Routes>
        // </div>
