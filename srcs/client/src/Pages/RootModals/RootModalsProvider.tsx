import React, { useState } from 'react';

// Context creation
export const RootModalsContext = React.createContext([] as any);

const RootModalsProvider = (props: any) => {
  // Modal states to share to other components (this one is an example)
  const [showGameChallenge, setShowGameChallenge] = useState(false);

  return (
    <RootModalsContext.Provider
      value={[showGameChallenge, setShowGameChallenge]}
    >
      {props.children}
    </RootModalsContext.Provider>
  );
};

export default RootModalsProvider;
