import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import App from './App';
import './index.css';
import UserContextProvider from './Context/UserContext';

  /*
  ** Root of the project
*/
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement as HTMLElement
);

root.render(
  <UserContextProvider>
    <App />
  </UserContextProvider>
);
