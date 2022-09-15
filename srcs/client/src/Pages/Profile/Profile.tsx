import React from "react";
import {useState, useEffect} from 'react'
import "./profile.css"
import "../../Components/Tools/Text.css"
import "../../Components/Tools/Box.css"
import PhotoProfil from './PhotoProfil'
import OnlineOffline from './OnlineOffline'
import ChangePseudo from './ChangePseudo'
import ChangePicture from './ChangePicture'
import DoubleAuth from './DoubleAuth'
import Ladder from './Ladder'
import MatchHistory from './MatchHistory'
import FriendList from './FriendList'
import {getFetch} from './getFetch'
import { useLocation } from "react-router-dom";

export default function Profile () {

    let location = useLocation();

    const {userID} : any  = location.state; //Destructuring
    const [user, setUser] : any = useState(null);

    // const [test, setTest] : any = useState(
    //     {
    //         "id": 1,
    //         "username": "fmonbeig",
    //         "email": "fmonbeig@student.42.fr",
    //         "createdAt": "2022-09-02T13:22:33.662Z",
    //         "profilePicture": "https://cdn.intra.42.fr/users/fmonbeig.jpg",
    //         "currentStatus": 1,
    //         "eloRating": 1000,
    //             "stats": {
    //             "id": 0,Matcvarssed": [],
    //         "matches": [],
    //         "achievements": []
    //       }
    // )

    useEffect(() => {
        let request = "http://127.0.0.1:4200/users/" + userID;
        console.log(request);
        const json = getFetch({url : request});
        json.then((responseObject)=> {
            setUser(responseObject);
    })
    },[userID]);

    console.log(user);
    if(user)
    {
        return (
            <>
            <div className="profilAndLadder" data-testid="tracker">
                <div className="profil">
                    <div className="picture">
                        <PhotoProfil url={user.profilePicture}/>
                    </div>
                    <div className="status">
                        <div className="yellowTextProfil" style={{fontSize: "2vw", fontWeight: "bold"}}> {user.username}</div>
                        <br/>
                        <OnlineOffline status={user.currentStatus}/>
                        {/* faire un bouton permettant de passer offline */}
                    </div>
                    <div className="changeProfil">
                            {/* We need to create button / Component with click */}
                            <ChangePseudo id={userID}/>
                            <ChangePicture id={userID}/>
                            <DoubleAuth/>
                    </div>
                    </div>
                    <div className="ladder">
                            <Ladder stats={user.stats} elo={user.eloRating}/>
                </div>
            </div>
            <div className='matchFriend'>
                <div className="match">
                    <MatchHistory/>
                </div>
                <div className="friend">
                    <FriendList/>
                </div>
            </div>

            </>
        );
    }
    return(<></>);
}

// chaque variable avec [] possede une variable lenght qui sera egale a 0 s'il n'y a rien
// ex : user.friendshipRequested.lenght  ? affiche ca : sinon affiche ca
// SANS RIEN DEDANS
// {
//     "id": 1,
//     "username": "fmonbeig",
//     "email": "fmonbeig@student.42.fr",
//     "createdAt": "2022-09-02T13:22:33.662Z",
//     "profilePicture": "https://cdn.intra.42.fr/users/fmonbeig.jpg",
//     "currentStatus": 1,
//     "eloRating": 1000,
//     "stats": null,
//     "ratingHistory": [],
//     "ownedChannels": [],
//     "channels": [],
//     "friendshipRequested": [],
//     "friendshipAddressed": [],
//     "matches": [],
//     "achievements": []
//   }

    // USER
//{id: 1, username: 'fmonbeig', email: 'fmonbeig@student.42.fr',
//createdAt: '2022-09-01T09:00:06.542Z',
//profilePicture: 'https://cdn.intra.42.fr/users/fmonbeig.jpg', …}
