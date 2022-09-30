import React from 'react'
import "../../../Components/Tools/Text.css"
import "../../../Components/Tools/Box.css"
import "../profile.css"
import {requestFriendship} from "../Fetch/requestFriendship"

export default function AddFriend(props : any) {

	let url = "http://127.0.0.1:4200/users/" + props.originalId + "/friends";
	return (
		<>
			<button className="yellowPinkBoxButtonProfil"
			style={{
				width: "100%",
				height: "auto",
			}}
			onClick={()=>(requestFriendship({url: url, addresseeId: props.id}))}
			>
				<div className="greenText" style={{fontSize: "1vw"}}>
					Add Friend
				</div>
			</button>
		</>
 		);
}
