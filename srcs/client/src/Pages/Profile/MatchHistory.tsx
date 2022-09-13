import React from 'react'
import "../../Components/Tools/Text.css"
import "../../Components/Tools/Box.css"


export default function MatchHistory() {

	return (
		<div className="blueBoxMatch"
		style={{
				width: "100%",
				height: "100%",
			}}>
			<div className="yellowText" style={{fontSize: "3vw"}}> Match History </div>
			<br/>
			<div className="scrollBox" >
				<div className="blueTextMatch" style={{fontSize: "2vw"}}> LEO VS RAY  </div>
				<div className="blueTextMatch" style={{fontSize: "2vw"}}> LEO VS RAY  </div>
				<div className="blueTextMatch" style={{fontSize: "2vw"}}> LEO VS RAY  </div>
				<div className="blueTextMatch" style={{fontSize: "2vw"}}> LEO VS RAY  </div>
				<div className="blueTextMatch" style={{fontSize: "2vw"}}> LEO VS RAY  </div>
			</div>
		</div>
 		);
}
