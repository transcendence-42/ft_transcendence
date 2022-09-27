import React from 'react'
import "../../../Components/Tools/Text.css"
import "../../../Components/Tools/Box.css"
import "../profile.css"
import {updateFriendship} from "../Fetch/updateFriendship"

export default function FriendshipRejected(props : any) {
	// console.log("ADDFRIEND USER ID", props.id)
	// console.log("ADDFRIEND VIEWER ID", props.originalId)

	function onClickAccepted(){
		updateFriendship({
			url: "http://127.0.0.1:4200/friendship",
			addresseeId: props.id,
			originalId: props.originalId,
			status:2});
			props.up();
	}

	return (
		<>
			<button className="btn"
			onClick={()=>(onClickAccepted())}
			>
				<div className="redText" style={{fontSize: "1.2vw"}}>
					Reject
				</div>
			</button>
		</>
 		);
}
