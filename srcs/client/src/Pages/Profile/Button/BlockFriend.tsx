import React from 'react'
import "../../../Components/Tools/Text.css"
import "../../../Components/Tools/Box.css"
import "../profile.css"

export default function BlockFriend(props : any) {

	// console.log("ADDFRIEND USER ID", props.id)
	// console.log("ADDFRIEND VIEWER ID", props.originalId)

	function doSomething() {
		console.log("rien");
	}

	return (
		<>
			<button className="yellowPinkBoxButtonProfil"
			style={{
				width: "100%",
				height: "auto",
			}}
			onClick={()=>(doSomething())}
			>
				<div className="redText" style={{fontSize: "1vw"}}> Block Friend </div>
			</button>
		</>
 		);
}


// onClick={()=>(patchFetchPseudo({url: request, name: newPseudo}))}
// let request = "http://127.0.0.1:4200/users/" + userID;
// console.log(request);
// const json = getFetch({url : request});
