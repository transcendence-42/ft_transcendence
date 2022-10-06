import React from 'react'
import "../../../Components/Tools/Text.css"
import "../../../Components/Tools/Box.css"
import "../profile.css"
import ModalChangePseudo from "../Modal/ModalChangePseudo"
import { useState } from "react";

const ChangePseudo = (props : any) => {

	const [isShowing, setIsShowing] = useState(false);

	function toggle() {
		setIsShowing(!isShowing);
	}

	return (
		<>
			<button className="btn btn-blue text-blue"
			style={{
				width: "100%",
				height: "auto",
			}}
			onClick={()=>(toggle())}
			>
				<div style={{fontSize: "0.8em"}}>
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

export default ChangePseudo;
