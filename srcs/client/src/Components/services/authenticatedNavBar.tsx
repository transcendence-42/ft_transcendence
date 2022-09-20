
import { Cookies, useCookies } from "react-cookie";
import {Navigate, Outlet} from "react-router-dom";
import { getCookie } from "react-use-cookie";
import React, { useEffect, useState } from "react";


const AuthenticatedNavBar = () =>{
  
    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    const cookies = new Cookies();
    const[cookie, setCookie] = useCookies(['auth-session']);
    console.log("value cookie");
    console.log(cookie);
    return cookie ? 0 : 1;
}


export default AuthenticatedNavBar; 
