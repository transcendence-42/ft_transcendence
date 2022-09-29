import React from 'react'
import "../../../Components/Tools/Text.css"
import "../../../Components/Tools/Box.css"
import "../profile.css"
import ModalChangePseudo from "../Modal/ModalChangePseudo"
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
				<div className="blueText" style={{fontSize: "1vw"}}>
					Change Username
				</div>
			</button>
				<ModalChangePseudo
					isShowing={isShowing}
					hide={toggle}
					id={props.id}
					up={props.up}/>
		</>
 		);
}
