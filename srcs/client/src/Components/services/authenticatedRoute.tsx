import React, { useContext } from "react";
import { Route, Navigate, Outlet} from "react-router-dom";
import Auth from "../Context/Auth";


const AuthenticatedRoute = (pathFree : any) =>{
  
    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    return localStorage.getItem("pathIsFree") ? <Outlet /> : <Navigate to="/login" />;
}

export default AuthenticatedRoute;