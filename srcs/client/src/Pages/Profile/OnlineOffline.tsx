import React from 'react'
import "../../Components/Tools/Text.css"
import "../../Components/Tools/Box.css"


export default function OnlineOffline(props : any) {

	if (props.status === 1){
  		return (
			<div className="greenText" style={{fontSize: "1.5vw"}}> ONLINE</div>
 		);
	}
	else
	{
		return(
			<div className="redText" style={{fontSize: "1.5vw"}}> OFFLINE</div>
		);
  }
}
