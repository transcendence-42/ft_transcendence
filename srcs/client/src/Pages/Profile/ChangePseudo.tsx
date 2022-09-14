import React from 'react'
import "../../Components/Tools/Text.css"
import "../../Components/Tools/Box.css"
import "./profile.css"
import {patchFetchPseudo} from "./patchFetchPseudo"
import ModalProfil from "./ModalProfil"
import { useState } from "react";

export default function ChangePseudo() {

	const [isShowing, setIsShowing] = useState(false);

	const [pseudo, setPseudo] = useState('');

	function handlePseudoChange(event : any ) {
		setPseudo(event.target.value);
	};

	function toggle() {
		setIsShowing(!isShowing);
	}

	let request = "http://127.0.0.1:4200/users/" + 1;
	let newPseudo = "Jesus4";

	return (
		<>
		{/* <form>
			<input
			type="text"
			id="name"
			name="name"
			maxLength={15}
			value={pseudo}
			onChange={handlePseudoChange}
			className="inputProfil"/>
			<input type="submit" />
		</form>
		<div className="yellowTextProfil" style={{fontSize: "2vw", fontWeight: "bold"}}> {pseudo}</div> */}
			{/* <button className="yellowPinkBoxButtonProfil"
			style={{
				width: "100%",
				height: "auto",
			}}
			onClick={()=>(toggle())}
			>
				<div className="blueText" style={{fontSize: "1vw"}}> Change your pseudo </div>
			</button>

			<ModalProfil isShowing={isShowing} hide={toggle} /> */}

			<button className="yellowPinkBoxButtonProfil"
			style={{
				width: "100%",
				height: "auto",
			}}
			onClick={()=>(patchFetchPseudo({url: request, name: newPseudo}))}
			>
				<div className="blueText" style={{fontSize: "1vw"}}> Change your pseudo </div>
			</button>
		</>
 		);
}

// let request = "http://127.0.0.1:4200/users/" + userID;
// console.log(request);
// const json = getFetch({url : request});
