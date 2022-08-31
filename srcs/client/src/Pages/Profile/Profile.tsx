import React from "react";
import {useState, useEffect} from 'react'
import "./profile.css"
import { useLocation } from "react-router-dom";
import { Link, Outlet ,useParams } from "react-router-dom";

/* Pour exporter l'id on include UseParams and we call it with the variable.id */
export default function Profile () {


  let location = useLocation();
  // props.history.push("/");
  console.log(location);

    // const [user, setUser] = useState(null);
    // // const [loginOrRegister, setAuthState]= useState(null);
    // useEffect(() => {
    //   const getUser = () => {
    //     fetch("http://127.0.0.1:4200/auth/success", {
    //       method: "GET",
    //       credentials: "include",
    //       headers: {
    //         Accept: "application/json",
    //         "Content-Type": "application/json",
    //         "Access-Control-Allow-Credentials": "true",
    //       }
    //     })
    //       .then((response) => {
    //         console.log(response.status);
    //         // if (response.status === 200)
    //           return response.json();
    //         // throw new Error("authentification failed.");
    //       })
    //       .then((responseObject) => {
    //         console.log(
    //           "this is response from fetch: ",
    //           JSON.stringify(responseObject, null, 4)
    //         );
    //         setUser(responseObject.user);
    //       })
    //       .catch((err) => console.log(err));
    //   };
    //   getUser();
    // },[]);

    return (
        <div>
            <h1 className="title"> Profile of </h1>
            <br />
            <p className="id">fdjkfdjk</p>
            <br />
        </div>
    )
}
