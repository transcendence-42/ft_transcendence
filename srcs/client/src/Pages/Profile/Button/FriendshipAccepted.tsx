import React from 'react'
import "../../../Components/Tools/Text.css"
import "../../../Components/Tools/Box.css"
import "../profile.css"
import {updateFriendship} from "../Fetch/updateFriendship"

export default function FriendshipAccepted(props : any) {

	function onClickAccepted(){
		updateFriendship({
			url: "http://127.0.0.1:4200/friendship",
			addresseeId: props.id,
			originalId: props.originalId,
			status:1});
			props.up();
	}

	return (
		<>
			<button className="btn"
			onClick={()=>(onClickAccepted())}
			>
				<div className="greenText" style={{fontSize: "1.2vw"}}>
					Accept
				</div>
			</button>
		</>
 		);
}
