import React, { createContext } from "react";

export default createContext({
    isConnected: false,
    isFromAuth: false,
    updateIsConnected:((name: boolean) => {}),
    updateIsFromAuth:((name: boolean) => {})
});