import React, { useEffect } from "react";
import "./Login.css"

function Login ()  {
/*
** By clicking on the 42Auth back office handling the following steps, Front is just keeping into memory
** that user has clicked on 42Auth
*/
  const fortyTwoLogin = () => {
		window.open("http://127.0.0.1:4200/auth/42/register", "_self");
    localStorage.setItem("fromAuth", JSON.stringify(true));
	}

/*
** Here is just a security, because Back office in case of Auth fail will redirect to login page,
** so we delete the variable fromAuth to avoid any problems of multiple instantiations 
*/
  useEffect(() => {
    const data = localStorage.getItem("fromAuth");
    if (data)
    {
        window.localStorage.removeItem('fromAuth');
    }
  },[]);

  return (
    <div data-testid="tracker" className="body">
      <div className="title">
        <h2 className="pinkText " style={{fontSize: "4vw"}}> Choose your login method  </h2>
      </div>  
      <div className="container1">
        <div className="screen1">
            <button className="playFlickering"style={{cursor:"pointer"}} onClick={fortyTwoLogin}>42 Login</button>
          </div>    
        <div className="screen2"> 
            <button className="playFlickering"style={{cursor:"pointer"}}>Email Login</button>
            </div>    
        </div>    
    </div>
  );
};


export default Login;


