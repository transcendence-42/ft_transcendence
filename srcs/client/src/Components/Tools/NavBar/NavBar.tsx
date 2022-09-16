import React, { useEffect, useState } from "react";
import "./NavBar.css"
import ProfilNavBar from "../Button/ProfilNavBar";
import PhotoProfil from '../../../Pages/Profile/PhotoProfil'
import "../Text.css"
import '../Box.css';
import { Link } from "react-router-dom";

import { useCookies } from 'react-cookie';


export default function NavBar ()
{
    // eslint-disable-next-line
    const [user, setUser] = useState(null);
    const [isLogged, setIsLogged] = useState(false);
    // eslint-disable-next-line
    const [cookies, setCookie] = useCookies(undefined);
    const [fromAuth, setFromAuth] = useState(false);
    const [userID, setUserID] = useState<number>(1);

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
            console.log("ici end");
            throw console.log("Fail parsing 42auth");
        })
        .then((responseObject) => {
            if (responseObject.message)
            {
                setUser((responseObject));
                console.log(responseObject);
                console.log("Success parsing 42auth");
                setIsLogged(true);
                localStorage.setItem("pathIsFree", JSON.stringify(true));
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
                setUser(null);
                console.log("Disconnect from our services");
                setIsLogged(false);
                localStorage.removeItem("pathIsFree");
                return;
            }
         })
         .catch((err) => console.log(err));
     };

   /*
    ** Here it allows us to access the data into the local storage and not loosing our state "connected"
    */
    useEffect(() => {
        const data = window.localStorage.getItem("StillConnected");
        if (data)
        {
            setIsLogged(JSON.parse(data));
        }

      }, []);

    /*
    ** Here it allows us to create the data into the local storage
    */
    useEffect(() => {
        window.localStorage.setItem("StillConnected", JSON.stringify(isLogged));
    });


   /*
    ** Here it allows us to access the data into the local storage and not loosing our state from "auth42"
    */
    useEffect(() => {
        const data = localStorage.getItem("fromAuth");
        if (data)
        {
            setFromAuth(JSON.parse(data));
        }

      }, []);

    /*
    ** Here it create the data to be into the local storage
    */
    useEffect(() => {
        localStorage.setItem("fromAuth", JSON.stringify(fromAuth));
    });

    /*
    ** Here this function allows us to fetch our first data and start the connection flow only if we are from auth42 page
    */
     useEffect(() => {
        if (cookies !== undefined && fromAuth === true)
        {
            getUser();
            setFromAuth(false) ;
        }
     }, [cookies, fromAuth]);

    if (isLogged)
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
                        <Link  to="/profile" state={{userID}}> <PhotoProfil url={"https://cdn.intra.42.fr/users/fmonbeig.jpg"}  width={"5vw"} height={"5vw"}/> </Link>
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


