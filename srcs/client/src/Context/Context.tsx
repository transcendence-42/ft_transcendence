import { createContext } from "react";

/*
** Here is the context used and spread on App.tsx
*/
export default createContext({
    isConnected: false,
    isFromAuth: false,
    updateIsConnected:((name: boolean) => {}),
    updateIsFromAuth:((name: boolean) => {})
});