import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Context from "../../Context/Context";
import './home.css';
import "../../Components/Tools/Box.css"
import "../../Components/Tools/Text.css"
import "../../Components/Tools/VirtualPong/virtualPong.css"
import 'bootstrap/dist/css/bootstrap.min.css';




export default function Home () {
/*
** Init of the context again to use it and refresh it from App.tsx
*/
const contextValue = useContext(Context);
const [fromAuth, setFromAuth] = useState(false);

/*
** First function to Auth the user from our app -> 42Auth -> back -> front 
*/
const getUser = async () => {
  await  fetch("http://127.0.0.1:4200/auth/success", {
      method: "GET",
      credentials: "include",
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": "true",
      }
  })
  .then((response) => {
      if(!response.ok)
      {
          console.log("!response");
          throw new Error('Fail parsing 42auth you probably denied auth42');
      }
      if (response.status === 200)
      {
          console.log("response 200");
          return response.json();
      }
      else if (response.status === 403)
      {
          console.log("response 403");
          return Promise.reject();

      }
      throw console.log("Fail parsing 42auth");
  })
  .then((responseObject) => {
      if (responseObject.message)
      {
          console.log(responseObject);
          console.log("Success parsing 42auth");
        
          localStorage.setItem("pathIsFree", JSON.stringify(true));
          contextValue.updateIsConnected(true);
          return;
      }
      throw new Error('Something went wrong');
  })
  .catch((err) => console.log(err));
};

/*
** Here we set quickly the fromAuth local storage and delete it as safeguard to be sure we are from login page 
*/
useEffect(() => {
  const data = localStorage.getItem("fromAuth");
  if (data)
  {
      getUser();
      setFromAuth(false) ;
      window.localStorage.removeItem('fromAuth');
  }
},[]);

/*
** If we are connected we have the options of playing and watch, otherwise we do not have it 
** The contextValue.isConnected is the context init in App.tsx  
*/
if (!(contextValue.isConnected))
{
    return (
    <>
    <body>
      <div className="container">
        <div className="row pt-5">
          <h1 className="h1 pinkText text-center ">ENTER THE PONG CONTEST !</h1>
        </div>
        <div className=" row blueText text-center pt-5">
          <h4 >Confront other players online and become the best at Pong! </h4>
        </div>
        <div className="row field1 text-center pt-5">
          <div className="col"></div>
          <div className=" field text-center col-10 col-sm-10 col-md-10 col-lg-8 col-xl-6">
            <div className="net text-center"></div>
            <div className="ping text-center"></div>
            <div className="pong text-center"></div>
            <div className="ball text-center"></div>
           </div>
           <div className="col"></div>
        </div>
        <div className=" row blueText pt-5 ">
          <h5 className="text-center" >Join Players From 42 School</h5>
        </div>
        </div>
        </body>
    </>
    );
  }
  else
  {
    return (
      <>
     
     <div >
          <h1 className="h1 pinkText">ENTER THE PONG CONTEST !</h1>
        </div>
    
        <div className=" container">
          <div className="col-size field">
            <div className="net"></div>
            <div className="ping"></div>
            <div className="pong"></div>
            <div className="ball"></div>
            <button type="button" className="btn blueContainer1 pull-right" >
            <Link className="playFlickering" style={{ cursor: "pointer" }} to={"/mapchoice"}> PLAY </Link> 
            </button>
            <button type="button" className="btn blueContainer2 pull-left">
              <Link className="playFlickering" style={{ cursor: "pointer" }} to={"/mapchoice"}> WATCH  </Link> 
            </button>
          </div>
          
        </div>
        <div className=" blueText">
          <br />
          <h4 >Confront other players online and become the best at Pong! </h4>
        </div>
       </>
  );
}
}
