import NavBar from "../../Components/Tools/NavBar/NavBar";

import  "../../App.css"
import "../../Components/Context/Auth"
import { useContext, useEffect, useState, Component } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Auth from "../../Components/Context/Auth";
import { hasAuthenticated } from "../../Components/services/authApi";





function Login ()  {
  
  const[isAuthenticated, setIsAuthenticated] = useState(hasAuthenticated);
 
  // useEffect(() => {
  //   setIsAuthenticated(JSON.parse(window.localStorage.getItem('isAuthenticated') || '{}'));
  // }, []);

  // useEffect(() => {
  //   window.localStorage.setItem('isAuthenticated', isAuthenticated.toString() ) ;
  // }, [isAuthenticated]);


  const fortyTwoLogin = () => 
  {
    if(isAuthenticated === false)
    {
     
      console.log("ta mere");
      setIsAuthenticated((true))
    }
    if(isAuthenticated === true)
    {
     
      console.log("ta grand mere");
      setIsAuthenticated((false))
    }

    
    
    console.log(isAuthenticated);
  }

  
  return (
    <div>
          <h1 className="loginTitle">Choose your Login Method:</h1>
            <div className="wrapper">
              <div className="left">
                <button className="loginButton fortyTwo" onClick={fortyTwoLogin}>Login 42</button>
              </div>
              <div className="center">
                <div className="line" />
                <div className="or">OR</div>
              </div>
              <div className="right">
                <input type="text" placeholder="username" />
                <input type="text" placeholder="password" />
                <button className="submit">Login</button>
              </div>
            </div>
    </div>
  );
};

export default Login;