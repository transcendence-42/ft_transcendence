import React from "react";
import {useState} from 'react'
import TREE from './tree.jpg'
import "./profile.css"
import "../../Components/Tools/Text.css"
import PhotoProfil from '../../Components/Tools/Button/PhotoProfil'
import { useLocation } from "react-router-dom";

/* Pour exporter l'id on include UseParams and we call it with the variable.id */
export default function Profile () {

    let location = useLocation();
    // console.log(location);
    const {userID} : any  = location.state; //Destructuring
    const [user, setUser] : any = useState(null);

    const [test, setTest] : any = useState(
        {
            "id": 1,
            "username": "fmonbeig",
            "email": "fmonbeig@student.42.fr",
            "createdAt": "2022-09-02T13:22:33.662Z",
            "profilePicture": "https://cdn.intra.42.fr/users/fmonbeig.jpg",
            "currentStatus": 1,
            "eloRating": 1000,
                "stats": {
                "id": 0,
                "wins": 100,
                "losses": 2,
                "user": "string",
                "userId": 0
                },
            "ratingHistory": [],
            "ownedChannels": [],
            "channels": [],
            "friendshipRequested": [],
            "friendshipAddressed": [],
            "matches": [],
            "achievements": []
          }
    )

    // useEffect(() => {
    //     console.log(userID);
    //     let request = "http://127.0.0.1:4200/users/" + userID;
    //     console.log(request);
    //     const json = getFetch({url : request});
    //     json.then((responseObject)=> {
    //         setUser(responseObject);
    // })
    // },[userID]);

    console.log(test);
    //Pré remplir les variables pour stats
    if(test)
    {
        return (
            <>
            <div className="profilAndLadder" data-testid="tracker">
                <div className="profil">
                    <div className="picture">
                        <PhotoProfil/>
                    </div>
                    <div className="status">
                        <h1 className="yellowText" style={{fontSize: "2vw", fontWeight: "bold"}}> {test.username}</h1>
                        <br/>
                        <h1 className="greenText" style={{fontSize: "1.5vw"}}> {test.currentStatus ? 'ONLINE' : 'OFFLINE'} </h1>
                    </div>
                    <div className="infoProfil">
                            {/* We need to create button / Component with click */}
                            <div className="yellowPinkBoxButtonProfil"
                                style={{
                                    width: "100%",
                                    height: "auto",
                                }}>
                                    <h1 className="blueText" style={{fontSize: "1vw"}}> Change your pseudo </h1>
                                </div>
                                <div className="yellowPinkBoxButtonProfil"
                                style={{
                                    width: "100%",
                                    height: "auto",
                                }}>
                                    <h1 className="blueText" style={{fontSize: "1vw"}}> Change your picture  </h1>
                                </div>
                                <div className="yellowPinkBoxButtonProfil"
                                style={{
                                    width: "100%",
                                    height: "auto",
                                }}>
                                    <h1 className="blueText" style={{fontSize: "1vw"}}> Double Authentification Factor </h1>
                                </div>
                    </div>
                    </div>
                    <div className="ladder">
                        <div className="blueBoxLadder">
                            <div className="yellowPinkBoxLadder"
                                style={{
                                    width: "8vw",
                                    height: "8vw",
                                }}>
                                <h1 className="blueText" style={{fontSize: "1.2vw"}}> RANK </h1>
                                <h1 className="yellowText" style={{fontSize: "2vw"}}> 0 </h1>
                            </div>
                            <div className="yellowPinkBoxLadder"
                                style={{
                                width: "8vw",
                                height: "8vw",
                                }}>
                                <h1 className="blueText" style={{fontSize: "1.2vw"}}> WINS </h1>
                                <h1 className="yellowText" style={{fontSize: "2vw"}}> {test.stats ? test.stats.wins : '0'} </h1>
                            </div>
                            <div className="yellowPinkBoxLadder"
                                style={{
                                width: "8vw",
                                height: "8vw",
                                }}>
                                <h1 className="blueText" style={{fontSize: "1.2vw"}}> LOSES </h1>
                                <h1 className="yellowText" style={{fontSize: "2vw"}}> {test.stats ? test.stats.losses : '0'} </h1>
                            </div>
                        </div>
                </div>
            </div>
            <div className='matchFriend'>
                <div className="match">
                    <div className="blueBoxMatch"
                        style={{
                         width: "100%",
                         height: "100%",
                        }}>
                        <h1 className="yellowText" style={{fontSize: "4vh"}}> Match History </h1>
                        <h1 className="blueText" style={{fontSize: "2vh"}}> LEO VS RAY  </h1>
                        <h1 className="blueText" style={{fontSize: "2vh"}}> LEO VS RAY  </h1>
                        <h1 className="blueText" style={{fontSize: "2vh"}}> LEO VS RAY  </h1>
                        <h1 className="blueText" style={{fontSize: "2vh"}}> LEO VS RAY  </h1>
                    </div>
                </div>
                <div className="friend">
                <div className="blueBoxMatch"
                        style={{
                         width: "100%",
                         height: "100%",
                        }}>
                        <h1 className="yellowText" style={{fontSize: "4vh"}}> Friend </h1>
                        <h1 className="blueText" style={{fontSize: "2vh"}}> SEB  </h1>
                        <h1 className="blueText" style={{fontSize: "2vh"}}> SEB  </h1>
                        <h1 className="blueText" style={{fontSize: "2vh"}}> SEB  </h1>
                        <h1 className="blueText" style={{fontSize: "2vh"}}> SEB  </h1>
                    </div>
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
