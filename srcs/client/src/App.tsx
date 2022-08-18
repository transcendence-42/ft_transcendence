import React from 'react';
import './App.css';

import { Route } from 'react-router-dom';
import EmailAuth from './components/emailAuth';
import SchoolAuth from './components/schoolAuth';


function App() {
  return (
    <div className="main">
        <Route path='/'>
          <EmailAuth />
          <SchoolAuth />
        </Route>
    </div>
  );
}

export default App;
