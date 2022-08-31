import React, { useEffect, useState } from "react";
import "./NavBar.css"
import "./ProfilNavBar.tsx"
import "../Text.css"
import ProfilNavBar from "./ProfilNavBar"
import '../Text.css';
import '../Box.css';
import SignIn from "./SignIn"
import { json } from "stream/consumers";
import Login from "../../../Pages/Login/Login";
import { Link } from "react-router-dom";
import { wait } from "@testing-library/user-event/dist/utils";

export default function NavBar()
{
    const [user, setUser] = useState(null);
    const [isLogged, setIsLogged] = useState(false);

    /*
    ** Fetching data and allow the user to connect using "useState" to true
    */
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
            console.log(response.status);
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
    };
    const deco = () => {
        fetch("http://127.0.0.1:4200/auth/logout", {
         method: "GET",
         credentials: "include",
         headers: {
           Accept: "application/json",
           "Content-Type": "application/json",
           "Access-Control-Allow-Credentials": "true",
         }
       })
         .then((response) => {
                 return response.json();
         })
         .then((responseObject) => {
            console.log(responseObject)
            if (responseObject.message)
            {
                setUser(null);
                console.log("Disconnect from our services");
                setIsLogged(false);
                return;
            }
         })
         .catch((err) => console.log(err));
     };

   /*
    ** Here it allows us to access the data into the local storage and not loosing our state "connected"
    */
    useEffect(() => {
        const data = localStorage.getItem("StillConnected");
        if (data)
        {
            setIsLogged(JSON.parse(data));
        }

      }, []);

    /*
    ** Here it allows us to create the data into the local storage
    */
    useEffect(() => {
        localStorage.setItem("StillConnected", JSON.stringify(isLogged));
    });

    /*
    ** Here this function allows us to fetch our first data and start the connection flow 
    */
     useEffect(() => {
         getUser()
     });

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
             <button onClick={deco} className="playFlickering"> DECO  </button>
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
                <div className="buttonInNavBar">
                <Link to="/login" className="playFlickering">Login</Link>
                 </div>

            </div>
        </div>
        )
    }
}
