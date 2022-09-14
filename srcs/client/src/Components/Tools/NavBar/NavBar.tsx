import React, { useContext, useEffect, useState } from "react";
import "./NavBar.css"
import ProfilNavBar from "../Button/ProfilNavBar";
import "../Text.css"
import '../Box.css';
import { Link } from "react-router-dom";
import { useCookies } from 'react-cookie';
import Context from "../../../Context/Context";


export default function NavBar ()
{

   
    const [fromAuth, setFromAuth] = useState(false);
    const [userID, setUserID] = useState<number>(1);
    const contextValue = useContext(Context);
    
    /*
    /*
    ** Fetching data and allow the user to connect using "useState" to true
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
    ** Fetching data for logout
    */
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
                console.log("Disconnect from our services");
                localStorage.removeItem('pathIsFree');
                contextValue.updateIsConnected(false);
                return;
            }
         })
         .catch((err) => console.log(err));
     };

    /*
    ** Here this function allows us to fetch our first data and start the connection flow only if we are from auth42 page
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

    if (contextValue.isConnected)
    {
        return (
            <div className="navBar">
                <div className="menuInNavBar">
                    <div className="buttonInNavBar">
                        <Link  to="/"> <h2 className="blueText">PONG</h2> </Link>
                    </div>
                    <div className="buttonInNavBar">
                        <Link  to="/home"> <h2 className="yellowText"  >Home</h2> </Link>
                    </div>
                    <div className="buttonInNavBar">
                        <Link  to="/about"><h2 className="yellowText" >About</h2> </Link>
                    </div>
                    <div className="buttonInNavBar">
                        <Link  to="/chat">  <h2 className="yellowText" >Chat</h2> </Link>
                    </div>
                    <div className="buttonInNavBar">
                        <Link  to="/leaderboard">  <h2 className="yellowText" >Leaderboard</h2> </Link>
                    </div>
                    <div className="buttonInNavBar">
                        <button onClick={deco} className="playFlickering">Logout</button>
                    </div>
                    <div className="buttonInNavBar">
                        <Link  to="/profile" state={{userID}}> <ProfilNavBar /> </Link>
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
                        <Link to="/"> <h2 className="blueText" data-testid="HomeLink"> PONG </h2> </Link>
                    </div>
                    <div className="buttonInNavBar">
                        <Link to="/">   <h2 className="yellowText" > Home </h2> </Link>
                    </div>
                    <div className="buttonInNavBar">
                        <Link to="/about">   <h2 className="yellowText" > About </h2> </Link>
                    </div>
                    <div className="buttonInNavBar">
                        <Link to="/leaderboard"> <h2 className="yellowText" data-testid="LeaderboardLink">Leaderboard</h2> </Link>
                    </div>
                    <div className="buttonInNavBar">
                        <Link to="/login" className="playFlickering">Login</Link>
                 </div>
            </div>
        </div>
        )
    }
}


