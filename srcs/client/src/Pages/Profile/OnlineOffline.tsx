import React from 'react'
import "../../Components/Tools/Text.css"
import "../../Components/Tools/Box.css"


export default function OnlineOffline(props : any) {

  	return (
		<>
			{ props.status === 1 ?
				<div className="greenText" style={{fontSize: props.size}}> ONLINE </div> :
				<div className="redText" style={{fontSize: props.size}}> OFFLINE </div>
			 }
		</>
 		);
}
