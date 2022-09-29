import React from 'react'
import "../../../Components/Tools/Text.css"
import "../../../Components/Tools/Box.css"


export default function FailAndSuccess(props : any) {

	if (props.status === 2)
	{return(<></>);}

  	return (
		<>
			{ props.status === 1 ?
				<div className="greenText" style={{fontSize: props.size}}> SUCCESS </div> :
				<div className="redText" style={{fontSize: props.size}}> FAIL </div>
			 }
		</>
 		);
}
