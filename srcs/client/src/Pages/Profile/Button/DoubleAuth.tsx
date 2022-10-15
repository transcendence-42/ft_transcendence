import React from 'react'
import "../../../Components/Tools/Text.css"
import "../../../Components/Tools/Box.css"
import ModalDoubleAuth from "../Modal/ModalDoubleAuth"
import { useState } from "react";
import { getFetchDeactivateDoubleAuth } from '../Fetch/getFetchDeactivateDoubleAuth';


export default function DoubleAuth(props : any) {

   /**
   * @props id:           ID of the user
   *        up:           function triggering a re-render
   *        authUp:       SetState of Double Factor
   *        activated:    state Double Factor
   *
   * A button triggering a Modal for 2fa authentication
   * by QrCode with Google authenticator. If the user already activated
   * the 2fa display "Activated".
   */

	const [isShowing, setIsShowing] = useState(false);
  const [showResponse, setShowResponse] = useState(0);

	function toggle() {
    setShowResponse(0);
		setIsShowing(!isShowing);
	}

	function deactivate2fa() {
		const res = getFetchDeactivateDoubleAuth();
		props.authUp(false);
	}

	return (
		<>
			{ props.activated ?
			<>
				<button className="btn btn-yellow m-1"
					style={{
						width: "100%",
						height: "auto",
					}}
				onClick={()=>(deactivate2fa())}
					>
						<div className="greenText" style={{fontSize: "0.8em"}}>
							Activated (Click to desactivate)
						</div>
				</button>
			</>
			:
			<>
			<button className="btn btn-yellow m-1"
			style={{
				width: "100%",
				height: "auto",
			}}
			onClick={()=>(toggle())}
			>
				<div className="yellowText" style={{fontSize: "0.8em"}}>
					Double Authentication
				</div>
			</button>
				<ModalDoubleAuth
				show={isShowing}
				closeHandler={toggle}
				id={props.id}
				up={props.up}
				authUp={props.authUp}
				textBtn1="Cancel"
				handleBtn1={toggle}
				textBtn2="Submit"
				handleBtn2={toggle}
				title="Double Authentication"
        showResponse={showResponse}
        setShowResponse={setShowResponse}
			/>
		</>
		}
		</>
 		);
}

