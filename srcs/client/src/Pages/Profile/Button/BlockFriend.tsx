import React from 'react'
import "../../../Components/Tools/Text.css"
import "../../../Components/Tools/Box.css"
import "../profile.css"

export default function BlockFriend(props : any) {

	// Feature incoming
	function blockSomeone() {
		console.log("Incoming");
	}

	return (
		<>
			<button className="btn btn-pink text-pink mt-1"
			style={{
				width: "100%",
				height: "auto",
			}}
			onClick={()=>(blockSomeone())}
			>
				<div style={{fontSize: "0.8em"}}>
					Block Friend
				</div>
			</button>
		</>
 		);
}
