import React from 'react'
import "../../Components/Tools/Text.css"
import "../../Components/Tools/Box.css"


export default function OnlineOffline(props : any) {

	function onClickChangeStatus()
	{
		if (response === "ONLINE")
			response = "OFFLINE";
		else
			response = "ONLINE";
	}

	let response : string;

	if (props.status === 1)
		response = "ONLINE";
	else
		response = "OFFLINE";


  	return (
			<button className="btn"
			onClick={()=>(onClickChangeStatus())}
			>{ response === "ONLINE" ?
				<div className="greenText" style={{fontSize: props.size}}> {response} </div> :
				<div className="redText" style={{fontSize: props.size}}> {response} </div>
			 }
			</button>
 		);
}
