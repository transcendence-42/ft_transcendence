import React from 'react'
import "../../../Components/Tools/Text.css"
import "../../../Components/Tools/Box.css"
import "../profile.css"
import { requestFriendship } from "../Fetch/requestFriendship"

const AddFriend = (props : any) => {

  const apiUrl: string = process.env.REACT_APP_API_URL as string;
	const url = `${apiUrl}/users/${props.originalId}/friends`;

	return (
		<>
			<button className="btn btn-blue text-blue"
			style={{
				width: "100%",
				height: "auto",
			}}
			onClick={()=>(requestFriendship({url: url, addresseeId: props.id}))}
			>
				<div style={{fontSize: "0.8em"}}>
					Add Friend
				</div>
			</button>
		</>
 		);
}

export default AddFriend;
