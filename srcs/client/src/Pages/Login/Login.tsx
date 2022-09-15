import React from "react";
import "./Login.css"

function Login ()  {
  const fortyTwoLogin = () => {
    
		window.open("http://127.0.0.1:4200/auth/42/register", "_self");
    localStorage.setItem("fromAuth", JSON.stringify(true));
	}

/*
** Here it allows us to create the data into the local storage
*/
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


