import React, { useEffect, useState } from "react";
import "./NavBar.css"
import ProfilNavBar from "../Button/ProfilNavBar";
import "../Text.css"
import '../Box.css';
import { Link } from "react-router-dom";
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

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
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <Link to ="/" className="navbar-brand">PONG</Link>
                    <button className="navbar-toggler navbar-button" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item active">
                                <Link to ="/home" className="nav-link active">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link to ="/about" className="nav-link active">About</Link>
                            </li>
                            <li className="nav-item">
                                <Link to ="/chat" className="nav-link active">Chat</Link>
                            </li>
                            <li className="nav-item">
                                <Link to ="/leaderboard" className="nav-link active">Leaderboard</Link>
                            </li>
                            <li className="nav-item">
                                <button onClick={deco} className="nav-link active navbar-button">Logout</button>
                            </li>
                            <li className="nav-item">
                                <Link to ="/profile" state={{userID}} className="nav-link active"> Profile </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
    else
    {
        return (
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <Link to ="/" className="navbar-brand">PONG</Link>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link to ="/" className="nav-link active" aria-current="page">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link to ="/about" className="nav-link active" aria-current="page">About</Link>
                            </li>
                            <li className="nav-item">
                                <Link to ="/leaderboard" className="nav-link active" aria-current="page">Leaderboard</Link>
                            </li>
                            <li className="nav-item">
                                <Link to ="/login" className="nav-link active" aria-current="page">Login</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}