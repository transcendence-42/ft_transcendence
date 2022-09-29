import React from "react";
import {useState, useEffect} from 'react'
import "./profile.css"
import "../../Components/Tools/Text.css"
import "../../Components/Tools/Box.css"
import AddFriend from './Button/AddFriend'
import BlockFriend from './Button/BlockFriend'
import PhotoProfil from '../../Components/Tools/Button/PhotoProfil'
import OnlineOffline from './OnlineOffline'
import ChangePseudo from './Button/ChangePseudo'
import ChangePicture from './Button/ChangePicture'
import DoubleAuth from './Button/DoubleAuth'
import Ladder from './Ladder'
import MatchHistory from './MatchHistory'
import FriendList from './FriendList'
import {getFetch} from './Fetch/getFetch'
import {getFetchMatch} from './Fetch/getFetchMatch'
import {getFetchFriends} from './Fetch/getFetchFriends'
import { useLocation } from "react-router-dom";

export default function Profile () {

    const location = useLocation();
    let {userID, originalId} : any  = location.state;
    const [user, setUser] : any = useState(null);
    const [friendList, setFriendList] : any = useState([]);
    const [matchesList, setMatchesList] : any = useState([]);
    const [update, setUpdate] = useState(2);

    function toggleUpdate() {
        setTimeout(() => {
            if (update === 2)
		        setUpdate(1);
            if (update === 1)
		        setUpdate(0);
            if (update === 0)
		        setUpdate(1);
        }, 100);
	}

    useEffect(() => {
        if (userID)
        {
            let request = "http://127.0.0.1:4200/users/" + userID;
            const user_json = getFetch({url : request});
            user_json.then((responseObject)=> {
                setUser(responseObject);
            })
            request = "http://127.0.0.1:4200/users/" + userID + "/friends";
            const friend_json = getFetchFriends({url : request});
            friend_json.then((responseObject)=> {
                setFriendList(responseObject);})
            request = "http://127.0.0.1:4200/users/" + userID + "/matches";
                const matches_json = getFetchMatch({url : request});
                matches_json.then((responseObject)=> {
                    setMatchesList(responseObject);})
        }
        },[userID, update]);

    if(user)
    {
        return (
            <>
            <div className="profilAndLadder" data-testid="tracker">
                <div className="profil">
                    <div className="picture">
                        <PhotoProfil url={user.profilePicture} width={"10vw"} height={"10vw"}/>
                    </div>
                    <div className="status">
                        <div className="yellowTextProfil" style={{fontSize: "2vw", fontWeight: "bold"}}> {user.username}</div>
                        <br/>
                        <OnlineOffline status={user.currentStatus} size={"1.5vw"}/>
                    </div>
                    <div className="changeProfil">
                        { userID === originalId ?
                        <>
                            <ChangePseudo id={userID} up={toggleUpdate}/>
                            <ChangePicture id={userID} up={toggleUpdate}/>
                            <DoubleAuth/>
                        </>
                        :
                        <>
                            <AddFriend id={userID} originalId={originalId}/>
                            <BlockFriend id={userID} originalId={originalId}/>
                        </>
                        }
                    </div>
                    </div>
                    <div className="ladder">
                            <Ladder stats={user.stats} elo={user.eloRating}/>
                </div>
            </div>
            <div className='matchFriend'>
                <div className="match">
                    <MatchHistory matchesList={matchesList} id={userID}/>
                </div>
                <div className="friend">
                    <FriendList friendList={friendList} id={userID} originalId={originalId} up={toggleUpdate}/>
                </div>
            </div>

            </>
        );
    }
    return(<></>);
}
