import React from 'react'
import "../../Components/Tools/Text.css"
import "../../Components/Tools/Box.css"


export default function ChangePseudo() {

	var test : number = 2;

	function dosomething() : any {

		console.log("dosomething");

	}

	return (
		<button className="yellowPinkBoxButtonProfil"
		style={{
			width: "100%",
			height: "auto",
		}}
		onClick={()=>(dosomething())}
		>
			<div className="blueText" style={{fontSize: "1vw"}}> Change your pseudo </div>
			<div className="blueText" style={{fontSize: "1vw"}}> {test}</div>
		</button>
 		);
}
