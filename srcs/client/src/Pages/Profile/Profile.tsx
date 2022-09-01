import React from "react";
import "./profile.css"
import { Link, Outlet ,useParams } from "react-router-dom";

/* Pour exporter l'id on include UseParams and we call it with the variable.id */
export default function Profile () {
    const params = useParams();
    return (
        <div>
            <h1 className="title"> Profile of </h1>
            <br />
            <p className="id">{params.id}</p>
            <br />
            <nav className="choice">
                <Link to="/profile/:id/friends" >friends </Link>
                <Link to="/profile/:id/" >Add friend </Link>
                <Link to="" >My ranking </Link>
                <Outlet />
            </nav>
        </div>
    )
}