import './App.css';

import { Routes, Route } from 'react-router-dom';
import Welcome from './components/welcome';
import React from 'react';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Welcome />}>
      </Route>
    </Routes>
  );
}

export default App;
