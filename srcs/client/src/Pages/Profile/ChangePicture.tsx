import React from 'react'
import "../../Components/Tools/Text.css"
import "../../Components/Tools/Box.css"
import "./profile.css"
import ModalChangePicture from "./ModalChangePicture"
import { useState } from "react";

export default function ChangePicture(props : any) {

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
				<div className="blueText" style={{fontSize: "1vw"}}> Change Picture </div>
			</button>
				<ModalChangePicture
				isShowing={isShowing}
				hide={toggle}
				id={props.id}
				up={props.up}
				title="Put an URL of your New Picture"
			 />
		</>
 		);
}
