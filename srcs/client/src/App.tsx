import React from 'react';
import './App.css';
import {Routes, Route} from 'react-router-dom';
import Home from './Components/Home/Home'
import Profile from './Components/Profile/Profile'
import Notfound from './Components/NotFound/notFound';
import NavBar from './Components/NavBar/NavBar';
import FriendsGame from './Components/MyFriends/MyFriends';
//<Route path="/" element={<Home />} />
//<Route path="/profile/:id" element={<Profile />}>
//<Route path="/profile/:id/friends" element={<FriendsGame/>} />
//</Route>
//<Route path="*" element={<Notfound />} />




//<NavBar />
//<Routes>
//  <Route></Route>
//</Routes>
//<Route path='/'>
//  <EmailAuth />
//  <SchoolAuth />
//
//</Route>
function App() {
  
  return (
    <div className="main">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:id" element={<Profile />}>
          <Route path="/profile/:id/friends" element={<FriendsGame/>} />
        </Route>
        <Route path="*" element={<Notfound />} />
      </Routes>
    </div>
  );
}

export default App;
