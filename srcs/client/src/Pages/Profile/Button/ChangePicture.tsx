import React from 'react'
import "../../../Components/Tools/Text.css"
import "../../../Components/Tools/Box.css"
import "../profile.css"
import ModalPicture from "../Modal/ModalPicture"
import { useState } from "react";

export default function ChangePicture(props : any) {

	const [isShowing, setIsShowing] = useState(false);

	function toggle() {
		setIsShowing(!isShowing);
	}
	return (
		<>
			<button className="btn btn-yellow m-1"
			style={{
				width: "100%",
				height: "auto",
			}}
			onClick={()=>(toggle())}
			>
				<div className="yellowText" style={{fontSize: "1.2vw"}}>
					Change Picture
				</div>
			</button>
				<ModalPicture
				show={isShowing}
				closeHandler={toggle}
				textBtn1="Cancel"
				handleBtn1={toggle}
				textBtn2="Submit"
				handleBtn2={toggle}
				title="Put an URL of your NEW Picture"
				id={props.id}
				up={props.up}
			 />
		</>
 		);
}



