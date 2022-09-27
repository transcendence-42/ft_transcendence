import React from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import App from './App';

/*
** Root of the project 
*/
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement as HTMLElement
);
root.render(
    <App />
);
