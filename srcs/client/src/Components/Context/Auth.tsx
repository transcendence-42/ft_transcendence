import React, { createContext, useContext, useState } from 'react';

/*
    isAuthenticated is a boolean value exposed by the Auth0Context. Its value is true when Auth0 has authenticated the user and false when it hasn't.
    It serves as a "log in/log out" 
*/

export default React.createContext({
  isAuthenticated: false,

  setIsAuthenticated: (value: boolean) => {}
});
