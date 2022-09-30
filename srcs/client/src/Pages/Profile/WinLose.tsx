import React from 'react'
import "../../Components/Tools/Text.css"
import "../../Components/Tools/Box.css"


export default function WinLose(props : any) {

	if (props.players[0].playerId === props.id)
	{
		if (props.players[0].status === 1){
			  return (
				<div className="greenText" style={{fontSize: props.size,}}> WIN</div>
			 );
		}
		else
		{
			return(
				<div className="redText" style={{fontSize: props.size}}> LOSE</div>
			);
		}
	}
	else
	{
		if (props.players[1].status === 1){
			  return (
				<div className="greenText" style={{fontSize: props.size,}}> WIN</div>
			 );
		}
		else
		{
			return(
				<div className="redText" style={{fontSize: props.size}}> LOSE</div>
			);
	}
	}
}
