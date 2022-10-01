import React from 'react'
import "../../Components/Tools/Text.css"
import "../../Components/Tools/Box.css"


export default function League(props : any) {

	/**
   * @props
   * elo: elo of the user
   * size: size of the font
   * Display the League of the user according of is Elo
   */

	if (props.elo >= 1500){
  		return (
			<>
				<div className="textGold" style={{fontSize: props.size}}> GOLD</div>
			</>
 		);
	}
	else if (props.elo >= 1100 && props.elo < 1500)
	{
		return(
			<div className="textSilver" style={{fontSize: props.size}}> SILVER</div>
		);
	}
	else if (props.elo >= 700 && props.elo < 1100)
	{
		return(
			<div className="textBronze" style={{fontSize: props.size}}> BRONZE </div>
		);
	}
	else
	{
		return(
			<div className="textIron" style={{fontSize: props.size}}> IRON</div>
		);
	}
}


