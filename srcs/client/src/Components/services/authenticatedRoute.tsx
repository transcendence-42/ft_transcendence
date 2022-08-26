import React, { useContext } from "react";
import { Route, Navigate, Outlet} from "react-router-dom";
import Auth from "../Context/Auth";


const AuthenticatedRoute = ({path, component}:any) =>{
    const { isAuthenticated } = useContext(Auth);

    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default AuthenticatedRoute;