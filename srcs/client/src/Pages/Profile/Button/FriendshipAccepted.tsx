import React from 'react'
import "../../../Components/Tools/Text.css"
import "../../../Components/Tools/Box.css"
import "../profile.css"
import {updateFriendship} from "../Fetch/updateFriendship"

export default function FriendshipAccepted(props : any) {

	// console.log("ADDFRIEND USER ID", props.id)
	// console.log("ADDFRIEND VIEWER ID", props.originalId)

	let url = "http://127.0.0.1:4200/friendship";

	return (
		<>
			<button className="btn"
			onClick={()=>(updateFriendship({
				url: url,
				addresseeId: props.id,
				originalId: props.originalId,
				status:1}))}
			>
				<div className="greenText" style={{fontSize: "1.2vw"}}> Accept </div>
			</button>
		</>
 		);
}
