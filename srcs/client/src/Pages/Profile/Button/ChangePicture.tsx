import React from 'react'
import "../../../Components/Tools/Text.css"
import "../../../Components/Tools/Box.css"
import "../profile.css"
import ModalChangePicture from "../Modal/ModalChangePicture"
import { useState } from "react";

export default function ChangePicture(props : any) {

	const [isShowing, setIsShowing] = useState(false);

	function toggle() {
		setIsShowing(!isShowing);
	}
	return (
		<>
			<button className="btn btn-blue text-blue mt-1"
			style={{
				width: "100%",
				height: "auto",
			}}
			onClick={()=>(toggle())}
			>
				<div style={{fontSize: "0.8em"}}>
					Change Picture
				</div>
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
