import React from 'react'
import "../../Components/Tools/Text.css"
import "../../Components/Tools/Box.css"
import "./profile.css"


export default function Ladder(props : any) {

	return (
		<div className="boxLadder">
			<div className="yellowPinkBoxLadder"
			style={{
				width: "8vw",
				height: "8vw",
			}}>
				<div className="blueText" style={{fontSize: "1.2vw"}}> ELO </div>
				<div className="yellowText" style={{fontSize: "2vw"}}> {props.elo} </div>
			</div>

			<div className="yellowPinkBoxLadder"
			style={{
				width: "8vw",
				height: "8vw",
			}}>
				<div className="blueText" style={{fontSize: "1.2vw"}}> WINS </div>
				<div className="yellowText" style={{fontSize: "2vw"}}> {props.stats ? props.stats.wins : '0'} </div>
			</div>

			<div className="yellowPinkBoxLadder"
			style={{
				width: "8vw",
				height: "8vw",
			}}>
				<div className="blueText" style={{fontSize: "1.2vw"}}> LOSES </div>
				<div className="yellowText" style={{fontSize: "2vw"}}> {props.stats ? props.stats.losses : '0'} </div>
			</div>
		</div>
 		);
}


