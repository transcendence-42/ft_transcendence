import React, { useContext } from "react";
import {Navigate, Outlet} from "react-router-dom";
import Context from "../../Context/Context";


const AuthenticatedRoute = (pathFree : any) =>{
  
    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    const contextValue = useContext(Context);
    
    return contextValue.isConnected ? <Outlet /> : <Navigate to="/login" />;
}


export default AuthenticatedRoute ; 
