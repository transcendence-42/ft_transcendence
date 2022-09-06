import React from "react";
import {useState, useEffect} from 'react'
import "./profile.css"
import "../../Components/Tools/Text.css"
import {getFetch} from './getFetch'
import { useLocation } from "react-router-dom";

/* Pour exporter l'id on include UseParams and we call it with the variable.id */
export default function Profile () {

    let location = useLocation();
    // console.log(location);
    const {userID} : any  = location.state; //Destructuring
    const [user, setUser] : any = useState(null);

    useEffect(() => {
        console.log(userID);
        let request = "http://127.0.0.1:4200/users/" + userID;
        console.log(request);
        const json = getFetch({url : request});
        json.then((responseObject)=> {
            setUser(responseObject);
    })
    },[userID]);

    if(user)
    {
        return (
            <>
            <div className="profilAndLadder" data-testid="tracker">
                <div className="profil">
                    <div className="picture">
                        <img src={user.profilePicture} alt="profil_picture"></img>
                    </div>
                    <div className="status">
                        <h1 className="yellowText" style={{fontSize: "3vw", fontWeight: "bold"}}> {user.username}</h1>
                    </div>
                    <div className="infoProfil">
                        <div className="blueBox">
                        <h1 className="blueText" style={{fontSize: "1.5vw"}}> email: {user.email}</h1>
                        </div>
                    </div>
                </div>
            </div>

            </>
        );
    }
    return(<></>);
}

    // USER
//{id: 1, username: 'fmonbeig', email: 'fmonbeig@student.42.fr',
//createdAt: '2022-09-01T09:00:06.542Z',
//profilePicture: 'https://cdn.intra.42.fr/users/fmonbeig.jpg', …}

// {
//     "id": 0,
//     "username": "string",
//     "email": "string",
//     "createdAt": "2022-09-01T15:36:48.003Z",
//     "profilePicture": "string",
//     "currentStatus": 0,
//     "currentLadder": 0,
//     "hasActivated2fa": true,
//     "credentials": {{
//     "id": 0,
//     "username": "string",
//     "email": "string",
//     "createdAt": "2022-09-01T15:36:48.003Z",
//     "profilePicture": "string",
//     "currentStatus": 0,
//     "currentLadder": 0,
//     "hasActivated2fa": true,
//     "credentials": {
//       "id": 0,
//       "email": "string",
//       "username": "string",
//       "password": "string",
//       "user": "string",
//       "userId": 0,
//       "twoFactorActivated": true,
//       "twoFactorSecret": "string"
//     },
//     "stats": {
//       "id": 0,
//       "wins": 0,
//       "losses": 0,
//       "user": "string",
//       "userId": 0
//     },
//     "rankingHistory": [
//       {
//         "id": 0,
//         "date": "2022-09-01T15:36:48.003Z",
//         "position": 0,
//         "user": "string",
//         "userId": 0
//       }
//     ],
//     "ownedChannels": [
//       {
//         "id": 0,
//         "name": "string",
//         "channelMode": 0,
//         "password": "string",
//         "owner": "string",
//         "ownerId": 0,
//         "users": [
//           {
//             "channel": "string",
//             "channelId": 0,
//             "user": "string",
//             "userId": 0,
//             "mode": 0
//           }
//         ]
//       }
//     ],
//     "channels": [
//       {
//         "channel": "string",
//         "channelId": 0,
//         "user": "string",
//         "userId": 0,
//         "mode": 0
//       }
//     ],
//     "friendshipRequested": [
//       {
//         "requester": "string",
//         "requesterId": 0,
//         "addressee": "string",
//         "addresseeId": 0,
//         "date": "2022-09-01T15:36:48.003Z",
//         "status": 0
//       }
//     ],
//     "friendshipAddressed": [
//       {
//         "requester": "string",
//         "requesterId": 0,
//         "addressee": "string",
//         "addresseeId": 0,
//         "date": "2022-09-01T15:36:48.003Z",
//         "status": 0
//       }
//     ],
//     "matches": [
//       {
//         "match": {
//           "id": 0,
//           "date": "2022-09-01T15:36:48.003Z",
//           "status": 0,
//           "players": [
//             "string"
//           ]
//         },
//         "matchId": 0,
//         "player": "string",
//         "playerId": 0,
//         "playerNum": 0,
//         "playerScore": 0
//       }
//     ],
//     "achievements": [
//       {
//         "achievement": {
//           "id": 0,
//           "name": "2022-09-01T15:36:48.004Z",
//           "usersStats": [
//             "string"
//           ]
//         },
//         "achievementId": 0,
//         "user": "string",
//         "userId": 0,
//         "date": "2022-09-01T15:36:48.004Z"
//       }
//     ]
//   }",
//       "userId": 0,
//       "twoFactorActivated": true,
//       "twoFactorSecret": "string"
//     },
//     "stats": {
//       "id": 0,
//       "wins": 0,
//       "losses": 0,
//       "user": "string",
//       "userId": 0
//     },
//     "rankingHistory": [
//       {
//         "id": 0,
//         "date": "2022-09-01T15:36:48.003Z",
//         "position": 0,
//         "user": "string",
//         "userId": 0
//       }
//     ],
//     "ownedChannels": [
//       {
//         "id": 0,
//         "name": "string",
//         "channelMode": 0,
//         "password": "string",
//         "owner": "string",
//         "ownerId": 0,
//         "users": [
//           {
//             "channel": "string",
//             "channelId": 0,
//             "user": "string",
//             "userId": 0,
//             "mode": 0
//           }
//         ]
//       }
//     ],
//     "channels": [
//       {
//         "channel": "string",
//         "channelId": 0,
//         "user": "string",
//         "userId": 0,
//         "mode": 0
//       }
//     ],
//     "friendshipRequested": [
//       {
//         "requester": "string",
//         "requesterId": 0,
//         "addressee": "string",
//         "addresseeId": 0,
//         "date": "2022-09-01T15:36:48.003Z",
//         "status": 0
//       }
//     ],
//     "friendshipAddressed": [
//       {
//         "requester": "string",
//         "requesterId": 0,
//         "addressee": "string",
//         "addresseeId": 0,
//         "date": "2022-09-01T15:36:48.003Z",
//         "status": 0
//       }
//     ],
//     "matches": [
//       {
//         "match": {
//           "id": 0,
//           "date": "2022-09-01T15:36:48.003Z",
//           "status": 0,
//           "players": [
//             "string"
//           ]
//         },
//         "matchId": 0,
//         "player": "string",
//         "playerId": 0,
//         "playerNum": 0,
//         "playerScore": 0
//       }
//     ],
//     "achievements": [
//       {
//         "achievement": {
//           "id": 0,
//           "name": "2022-09-01T15:36:48.004Z",
//           "usersStats": [
//             "string"
//           ]
//         },
//         "achievementId": 0,
//         "user": "string",
//         "userId": 0,
//         "date": "2022-09-01T15:36:48.004Z"
//       }
//     ]
//   }
