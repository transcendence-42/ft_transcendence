import React from 'react'
import "../../../Components/Tools/Text.css"
import "../../../Components/Tools/Box.css"
import "../profile.css"
import ModalUsername from "../Modal/ModalUsername"
import { useState } from "react";

export default function ChangeUsername(props : any) {

   /**
   * @props id:           ID of the user
   *        up:           function triggering a re-render
   *
   * A button triggering a Modal for changing the username
   */

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
					Change Username
				</div>
			</button>
				<ModalUsername
					show={isShowing}
					closeHandler={toggle}
					textBtn1="Cancel"
					handleBtn1={toggle}
					textBtn2="Submit"
					handleBtn2={toggle}
					title="Put your NEW Username"
					id={props.id}
					up={props.up}
				/>
		</>
 		);
}
