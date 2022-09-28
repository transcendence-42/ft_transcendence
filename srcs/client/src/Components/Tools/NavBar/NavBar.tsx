import React, { useContext, useEffect, useState } from "react";
import "./NavBar.css"
import PhotoProfil from '../Button/PhotoProfil'
import "../Text.css"
import '../Box.css';
import { Link } from "react-router-dom";
import { useCookies } from 'react-cookie';
import Context from "../../../Context/Context";

export default function NavBar (props : any)
{
    const contextValue = useContext(Context);

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
                        <Link state={{userID:props.userID, originalId: props.userID}} to="/profile">  <div className="btn textBlue" >
                            <PhotoProfil url={"https://cdn.intra.42.fr/users/fmonbeig.jpg"}  width={"5vw"} height={"5vw"}/>
                        </div> </Link>
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


