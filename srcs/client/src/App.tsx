import './App.css';

import { Routes, Route } from 'react-router-dom';
import Welcome from './components/welcome';
import React from 'react';


function App() {
  return (
    <div className="main">
      <Routes>
        <Route path='/' element={<Welcome />}>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
