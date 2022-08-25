import React from 'react';
import './Components/Tools/App.css';
import {Routes, Route} from 'react-router-dom';
import Home from './Components/Home/home'
import Profile from './Components/Profile/Profile'
import Notfound from './Components/NotFound/notFound';
import NavBar from './Components/Tools/NavBar/NavBar';

function App() {
  
  return (
    <div className="main">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:id" element={<Profile />}>
        </Route>
        <Route path="*" element={<Notfound />} />
      </Routes>
    </div>
  );
}

export default App;
