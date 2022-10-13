import React, { useEffect, useState, useContext } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './Pages/Home/home';
import Profile from './Pages/Profile/Profile';
import { getFetchSuccess } from './Pages/Profile/Fetch/getFetchSuccess';
import Notfound from './Pages/NotFound/notFound';
import Login from './Pages/Login/Login';
import About from './Pages/About/about';
import Leaderboard from './Pages/Leaderboard/leaderboard';
import Chat from './Pages/Chat/Chat';
import NavBar from './Components/Tools/NavBar/NavBar';
import AuthenticatedRoute from './Components/services/authenticatedRoute';
import Context from './Context/Context';
import GameLobby from './Pages/Game/GameLobby';
import RootModals from './Pages/RootModals/RootModals';
import RootModalsProvider from './Pages/RootModals/RootModalsProvider';
import GameSocketProvider, { GameSocketContext } from './Pages/Game/socket/socket';
import { ChatSocket } from "./Socket";
import { UserContext } from "./Context/UserContext";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isFromAuth, setIsFromAuth] = useState(false);
  const [userID, setUserID]: any = useState();
  const socket = useContext(GameSocketContext);

  function update(id: number) {
    setUserID(id);
  }

  /*
   ** Update the UserID when the page is refresh
   */
  const { login } = useContext(UserContext);
  if (!userID) {
    if (isConnected) {
      const success_json = getFetchSuccess();
      success_json.then((responseObject) => {
          // refresh user context
          login(responseObject.user?.id);
          // refresh game websocket
          socket.auth = {
            userId: responseObject.user?.id,
            pic: responseObject.user?.profilePicture,
            name: responseObject.user?.username,
          };
          // socket.connect();
          update(responseObject.user?.id);
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
        <RootModalsProvider>
          <BrowserRouter>
            <NavBar userID={userID} />
            <RootModals id={userID} />
            <Routes>
              <Route path="*" element={<Notfound />} />
              <Route
                index
                element={<Home updateID={update} userID={userID} />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route
                index
                element={<Home updateID={update} userId={userID} />}
              />
              <Route path="/" element={<AuthenticatedRoute res />}>
                <Route path="/about" element={<About />} />
                <Route path="/lobby" element={<GameLobby />} />
                <Route path="/chat" element={<Chat userID={userID} socket={ChatSocket} />} />
                <Route path="/profile/:id" element={<Profile />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </RootModalsProvider>
    </Context.Provider>
  );
}

export default App;
