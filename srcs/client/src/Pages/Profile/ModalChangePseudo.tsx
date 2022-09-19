import React from "react";
import ReactDOM from "react-dom";
import {useState} from 'react'
import {patchFetchPseudo} from "./patchFetchPseudo"
import "./ModalChangeContent.css"
import "../../Components/Tools/Text.css"
import "../../Components/Tools/Box.css"

export default function ModalChangePseudo({ isShowing, hide, id, up } : any) {

	const [content, setcontent] = useState('');
	const [url, setUrl] = useState('');

	function handleChange(event : any) {
		setcontent(event.target.value);
		setUrl("http://127.0.0.1:4200/users/" + id);
	};

	function patchAndClose(e : any)
	{
		e.preventDefault();
		console.log(content);
		console.log(url);
		patchFetchPseudo({url: url, name: content});
		// Add a check with the promise
		hide();
		up();
	}

	return (
		isShowing
		? ReactDOM.createPortal(
			<>
			  <div className="modal-overlay">
				<div className="modal-wrapper">
				  <div className="modal">
					<div className="modal-header">
					<div className="yellowText" style={{fontSize: "1.5em"}}> New Pseudo </div>
					  <button
						type="button"
						className="modal-close-button"
						onClick={hide}
					  >
						<span>&times;</span>
					  </button>
					</div>
					<form onSubmit={patchAndClose}>
						<input
							type="text"
							id="name"
							name="name"
							maxLength={18}
							value={content}
							onChange={handleChange}
							className="inputContent"/>
						<input type="submit" value="Ok" className="inputSubmit"/>
					</form>
					</div>
				</div>
			  </div>
			</>,
			document.body
		  )
		: null);
}
