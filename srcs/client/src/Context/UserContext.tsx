import React, { useState } from 'react';

export const UserContext = React.createContext({} as any);

const UserContextProvider = ({ children }: any) => {
  const [user, setUser] = useState({ id: undefined });

  const login = (id: number) => {
	setUser((prevState) => ({...prevState, id}));
  };

  return (
    <UserContext.Provider value={{ user, login }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
