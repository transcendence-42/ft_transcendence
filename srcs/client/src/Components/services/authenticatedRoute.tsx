import React, { useContext, useEffect } from "react";
import {Navigate, Outlet} from "react-router-dom";
import Context from "../../Context/Context";


const AuthenticatedRoute = (res: any) =>{
  
    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    const contextValue = useContext(Context);
    return localStorage.getItem("pathIsFree") ? <Outlet /> : <Navigate to="/" />;
}


export default AuthenticatedRoute ; 
