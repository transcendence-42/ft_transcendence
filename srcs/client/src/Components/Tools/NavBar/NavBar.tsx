import React, { useEffect, useState } from "react";
import "./NavBar.css"
import "./ProfilNavBar.tsx"
import "../Text.css"
import ProfilNavBar from "./ProfilNavBar"
import SignIn from "./SignIn"
import { json } from "stream/consumers";

export default function NavBar()
{
 //   let logged = false;
    const [user, setUser] = useState(null);
    const [isLogged, setIsLogged] = useState(false);
  // const [loginOrRegister, setAuthState]= useState(null);

    const getUser = () => {
       fetch("http://127.0.0.1:4200/auth/success", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": "true",
        }
      })
        .then((response) => {
            if (response.status === 200)
            {
                return response.json();
            }
           throw console.log("Fail parsing 42auth");
        })
        .then((responseObject) => {
            if (responseObject.message)
            {
                setUser((responseObject));
                console.log(responseObject);
                console.log("Success parsing 42auth");
                setIsLogged(true);
                return;
            }
        })
        .catch((err) => console.log(err));
        return(false)
    };
    useEffect(() => {
        getUser();
    },[isLogged]);
    

    if (isLogged)
    {
        return (
            <div className="navBar">
            <div className="menuInNavBar">
            <div className="buttonInNavBar">
            <a  href="/"> <h2 className="blueText"> PONG  </h2> </a>
             </div>
              <div className="buttonInNavBar">
              <a  href="/home"> <h2 className="yellowText"  > Home </h2> </a>
                
             </div>
             <div className="buttonInNavBar">
             <a  href="/about"><h2 className="yellowText" > About </h2> </a>
             </div>
             <div className="buttonInNavBar">
             <a  href="/chat">  <h2 className="yellowText" > Chat </h2> </a>
             </div>
             <div className="buttonInNavBar">
             <a  href="/leaderboard">  <h2 className="yellowText" > Leaderboard </h2> </a>
             </div>
             <div className="buttonInNavBar">
                <ProfilNavBar />
            </div>
            </div>
          </div>
        )
    }
    else 
    {
        return (
            <div className="navBar">
            <div className="menuInNavBar">
                <div className="buttonInNavBar">
                    <h2 className="blueText"> PONG </h2>
                </div>
                <div className="buttonInNavBar">
                    <h2 className="yellowText" > Home </h2>
                </div>
             <div className="buttonInNavBar">
                    <h2 className="yellowText" > About </h2>
                </div>
                <div className="buttonInNavBar">
                    <h2 className="yellowText" > Leaderboard </h2>
                </div>
                <div className="playFlickering" >
                    < SignIn />
                </div>
            </div>
        </div>
        )
    }
}


// <ul>
// <li className="element" ><a href="Pong">PONG</a></li>
// <li className="elementBlock"><a href="News">Leaderboard</a></li>
// <li className="elementBlock"><a href="Contact">About</a></li>
// <li className="elementBlock"><a href="About">Home</a></li>
// <li className="elementSignIn">
//         <span></span>
//         <span></span>
//         <span></span>
//         <span></span>
//         <button className="signinButton" onClick={fortyTwoLogin}>
//         Sign In
//         </button>
//         </li>
// < Header />
// </ul>
