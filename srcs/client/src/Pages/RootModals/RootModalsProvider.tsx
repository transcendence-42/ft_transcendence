import React, { useState } from 'react';

// Context creation
export const RootModalsContext = React.createContext([] as any);

const RootModalsProvider = (props: any) => {
  // Modal states to share to other components (this one is an example)
  const [showFirstConnection, setShowFirstConnection] = useState(false);
  const [showAlreadyConnected, setShowAlreadyConnected] = useState(false);

  return (
    <RootModalsContext.Provider
      value={[
        showFirstConnection,
        setShowFirstConnection,
        showAlreadyConnected,
        setShowAlreadyConnected,
      ]}
    >
      {props.children}
    </RootModalsContext.Provider>
  );
};

export default RootModalsProvider;
