import React from 'react'
import "../../Components/Tools/Text.css"
import "../../Components/Tools/Box.css"
import ModalProfil from "./ModalProfil"
import { useState } from "react";

export default function ChangePseudo() {

	const [isShowing, setIsShowing] = useState(false);

	function toggle() {
		setIsShowing(!isShowing);
	  }


	function dosomething() : any {

		console.log("bonjour");

	}

	return (
		<>
			<button className="yellowPinkBoxButtonProfil"
			style={{
				width: "100%",
				height: "auto",
			}}
			onClick={()=>(toggle())}
			>
				<div className="blueText" style={{fontSize: "1vw"}}> Change your pseudo </div>
			</button>

			<ModalProfil isShowing={isShowing} hide={toggle} />
		</>
 		);
}
