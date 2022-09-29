import React from 'react'
import "../../../Components/Tools/Text.css"
import "../../../Components/Tools/Box.css"
import ModalDoubleAuth from "../Modal/ModalDoubleAuth"
import { useState } from "react";


export default function DoubleAuth(props : any) {

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
					Double Authentication
				</div>
			</button>
				<ModalDoubleAuth
				isShowing={isShowing}
				hide={toggle}
				id={props.id}
				up={props.up}
				title="Put an URL of your New Picture"
			 />
		</>
 		);
}


