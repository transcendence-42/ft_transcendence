import React from 'react'
import "../../Components/Tools/Text.css"
import "../../Components/Tools/Box.css"


export default function OnlineOffline(props : any) {

	if (props.status === 1){
  		return (
			<div className="greenText" style={{fontSize: props.size}}> ONLINE</div>
 		);
	}
	else
	{
		return(
			<div className="redText" style={{fontSize: props.size}}> OFFLINE</div>
		);
  }
}
