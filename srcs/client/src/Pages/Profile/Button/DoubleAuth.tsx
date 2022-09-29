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
			<button className="btn btn-yellow m-1"
			style={{
				width: "100%",
				height: "auto",
			}}
			onClick={()=>(toggle())}
			>
				<div className="yellowText" style={{fontSize: "1.2vw"}}>
					Double Authentication
				</div>
			</button>
				<ModalDoubleAuth
				show={isShowing}
				closeHandler={toggle}
				id={props.id}
				textBtn1="Cancel"
        		handleBtn1={toggle}
				textBtn2="Submit"
        		handleBtn2={toggle}
				title="Double Authentication"
			 />
		</>
 		);
}


