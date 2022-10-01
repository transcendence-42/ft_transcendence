import React from 'react'
import "../../../Components/Tools/Text.css"
import "../../../Components/Tools/Box.css"
import ModalDoubleAuth from "../Modal/ModalDoubleAuth"
import { useState } from "react";

const DoubleAuth = (props : any) => {

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

export default DoubleAuth;
