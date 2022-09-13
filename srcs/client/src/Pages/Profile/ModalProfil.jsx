import React from "react";
import ReactDOM from "react-dom";
import {useState} from 'react'
import "./modal.css"
import "../../Components/Tools/Text.css"
import "../../Components/Tools/Box.css"

export default function Modal({ isShowing, hide }) {

	const [test, setTest] = useState("0");

	const onChangeHandler = event => {
		setTest(event.target.value);
	 };

	return (
		isShowing
		? ReactDOM.createPortal(
			<>
			  <div className="modal-overlay">
				<div className="modal-wrapper">
				  <div className="modal">
					<div className="modal-header">
					 <div className="yellowText"> New Pseudo </div>
					  <button
						type="button"
						className="modal-close-button"
						onClick={hide}
					  >
						<span>&times;</span>
					  </button>
					</div>
					{/* <form onSubmit={this.handleSubmit}>
						<label>
						<input
							type="text"
							name="name"
							onChange={onChangeHandler}
							value={test}
							/>
						</label>
      				</form> */}
						<div className="yellowText"> {test} </div>
				  </div>
				</div>
			  </div>
			</>,
			document.body
		  )
		: null);
}


// const [inputValue, setInputValue] = React.useState("");

// const onChangeHandler = event => {
//    setInputValue(event.target.value);
// };

// <input
//    type="text"
//    name="name"
//    onChange={onChangeHandler}
//    value={inputValue}
// />
