import React from "react";
import { Link, Outlet ,useParams } from "react-router-dom";

//Pour exporter l'id on include UseParams and we call it with the variable.id 
export default function Profile () {
    const params = useParams();
    console.log(params);
    return (
        <div>
            <br />
            <h1>Profile of </h1>
            <p>{params.id}</p>
            <br />
            <nav>
                <Link to="/profile/:id/friends" >friends </Link>
                <Link to="/profile/:id/" >Add friend </Link>
                <Link to="" >My ranking </Link>
                <Outlet />
            </nav>
        </div>
    )
}