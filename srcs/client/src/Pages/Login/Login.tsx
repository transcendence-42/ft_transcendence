import React, { useEffect } from "react";
import "./Login.css"
import 'bootstrap/dist/css/bootstrap.min.css';

function Login ()  {
/*
** By clicking on the 42Auth back office handling the following steps, Front is just keeping into memory
** that user has clicked on 42Auth
*/
  const fortyTwoLogin = () => {
    const apiUrl: string = process.env.REACT_APP_API_URL as string;
		window.open(`${apiUrl}/auth/42/register`, "_self");
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
    <div data-testid="tracker" className="container-fluid">
      <div className="row m-5 pt-5">
        <h2 className="pinkText text-center" style={{fontSize: "3vw"}}> Please click bellow to Login : </h2>
      </div>  
        <div className="row pt-5 ">
        <div className="col text-center">
            <button className="login col align-self-center "onClick={fortyTwoLogin}>42 Login</button>
        </div>    
        </div>  
        {/* <div className="screen2 col"> 
            <button className="playFlickering"style={{cursor:"pointer"}}>Email Login</button>
            </div>     */}
    </div>
  );
};


export default Login;


