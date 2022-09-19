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
    
        <div >
          <h1 className="h1 pinkText">ENTER THE PONG CONTEST !</h1>
        </div>
        <div className=" blueText">
          <br />
          <h4 >Confront other players online and become the best at Pong! </h4>
        </div>
        <div className=" container">
          <div className="col-size field">
            <div className="net"></div>
            <div className="ping"></div>
            <div className="pong"></div>
            <div className="ball"></div>
           </div>
        </div>
        <div className=" blueText   ">
          <br />
          <h5 className="text-center" >Join Players From 42 School</h5>
        </div>
      
    </>
    );
  }
  else
  {
    return (
      <>
     
        <div className="title1" data-testid="tracker">
          <h2 className="pinkText " style={{fontSize: "4vw"}}> ENTER THE PONG CONTEST ! </h2>  
        </div>   
          <div className="homeElement1">
            <h2 className="blueText" style={{fontSize: "1.5vw"}}>  Confront other players
                                                                online and become the best at Pong! </h2>
          </div>
          <div className="containerForField">
            <div className="field">
              <div className="net"></div>
              <div className="ping"></div>
              <div className="pong"></div>
              <div className="ball"></div>
              <div className="blueContainer1"style={{width: "10vw",height: "15%%", top: "14%"}}>     <Link className="playFlickering" style={{ cursor: "pointer" }} to={"/mapchoice"}> PLAY </Link> 
            </div>
            <div className="blueContainer2"style={{width: "10vw",height: "12%",top: "14%"}}>
              <div className="playFlickering"style={{cursor:"pointer"}}> WATCH </div>
            </div>
          </div>
        </div>
       </>
  );
}
}


// return (
//   <>
//      <div className="title1" data-testid="tracker">
//         <h2 className="pinkText " style={{fontSize: "4vw"}}> ENTER THE PONG CONTEST ! </h2>  
//       </div>   
//         <div className="homeElement1">
//           <h2 className="blueText" style={{fontSize: "1.5vw"}}>  Confront other players
//                                                               online and become the best at Pong! </h2>
//         </div>
//         <div className="containerForField">
//           <div className="field">
//             <div className="net"></div>
//             <div className="ping"></div>
//             <div className="pong"></div>
//             <div className="ball"></div>

//         </div>
//       </div>
//   </>
//   );
