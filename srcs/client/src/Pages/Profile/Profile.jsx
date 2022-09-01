import React from "react";
import {useState, useEffect} from 'react'
import "./profile.css"
import {getFetch} from './getFetch'
import { useLocation } from "react-router-dom";
import { Link, Outlet ,useParams } from "react-router-dom";

/* Pour exporter l'id on include UseParams and we call it with the variable.id */
export default function Profile () {

    let location = useLocation();
    // console.log(location);
    const {userID} = location.state; //Destructuring
    const [user, setUser] = useState(null);

    useEffect(() => {
        let request = "http://127.0.0.1:4200/users/" + userID;
        const json = getFetch({url : request});
        json.then((responseObject)=> {
            setUser(responseObject);
    })
    },[userID]);

    if(user)
    {
        console.log("This is");
        console.log(user);
        console.log(user.id);
        return (
            <div>
                <h1 className="title"> Profile of {user.username}</h1>
                <br />
                <p className="id">fdjkfdjk</p>
                <br />
            </div>
        )
    }

//{id: 1, username: 'fmonbeig', email: 'fmonbeig@student.42.fr',
//createdAt: '2022-09-01T09:00:06.542Z',
//profilePicture: 'https://cdn.intra.42.fr/users/fmonbeig.jpg', …}

}
