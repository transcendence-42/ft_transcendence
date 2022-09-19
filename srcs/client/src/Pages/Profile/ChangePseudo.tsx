import React from 'react'
import "../../Components/Tools/Text.css"
import "../../Components/Tools/Box.css"
import "./profile.css"
import ModalChangePseudo from "./ModalChangePseudo"
import { useState } from "react";

export default function ChangePseudo(props : any) {

	const [isShowing, setIsShowing] = useState(false);


	function toggle() {
		setIsShowing(!isShowing);
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
				<ModalChangePseudo isShowing={isShowing} hide={toggle} id={props.id} up={props.up}/>
		</>
 		);
}


// onClick={()=>(patchFetchPseudo({url: request, name: newPseudo}))}
// let request = "http://127.0.0.1:4200/users/" + userID;
// console.log(request);
// const json = getFetch({url : request});
