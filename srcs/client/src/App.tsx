import React, { useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './Pages/Home/home';
import Profile from './Pages/Profile/Profile';
import { getFetchSuccess } from './Pages/Profile/Fetch/getFetchSuccess';
import Notfound from './Pages/NotFound/notFound';
import Login from './Pages/Login/Login';
import About from './Pages/About/about';
import Leaderboard from './Pages/Leaderboard/leaderboard';
import Chat from './Pages/Chat/chat';
import NavBar from './Components/Tools/NavBar/NavBar';
import AuthenticatedRoute from './Components/services/authenticatedRoute';
import Context from './Context/Context';
import GameLobby from './Pages/Game/GameLobby';
import FakeProfile from './Pages/tmpProfile/FakeProfile';
import RootModals from './Pages/RootModals/RootModals';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isFromAuth, setIsFromAuth] = useState(false);
  const [userID, setUserID]: any = useState();

  function update(id: number) {
    setUserID(id);
  }

  /*
   ** Update the UserID when the page is refresh
   */

  if (!userID) {
    if (isConnected) {
      const success_json = getFetchSuccess();
      success_json.then((responseObject) => {
        update(responseObject.user.id);
      });
    }
  }

  /*
   ** Context is init here to spread it on all routes. Is connected to be sure 
   ** that the user is connected
   ** isFromAuth is to be sure that the user has been through the 42 Auth
   */
  const contextValue = {
    isConnected: isConnected,
    isFromAuth: isFromAuth,
    updateIsConnected: setIsConnected,
    updateIsFromAuth: setIsFromAuth,
  };

  /*
   ** Check if the user is still connected, it is working here from root for 
   ** all routes
   */
  useEffect(() => {
    var data = localStorage.getItem('pathIsFree');
    if (data) {
      contextValue.updateIsConnected(true);
    } else contextValue.updateIsConnected(false);
  }, []);
  /*
   ** Context.Provider surround all routes and spread the contextValue, 
   ** BrowserRouter allows us to use routes.
   ** Routes surround all route
   */

  return (
    <Context.Provider value={contextValue}>
        <BrowserRouter>
          <NavBar userID={userID} />
          <RootModals />
          <Routes>
            <Route path="*" element={<Notfound />} />
            <Route index element={<Home updateID={update} userID={userID} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route index element={<Home updateID={update} userId={userID} />} />
            <Route path="/" element={<AuthenticatedRoute res />}>
              <Route path="/about" element={<About />} />
              <Route path="/prof" element={<FakeProfile />} />
              <Route path="/lobby" element={<GameLobby />} />
              <Route path="/chat" element={<Chat userID={userID} />} />
              <Route path="/profile/:id" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
    </Context.Provider>
  );
}

export default App;
