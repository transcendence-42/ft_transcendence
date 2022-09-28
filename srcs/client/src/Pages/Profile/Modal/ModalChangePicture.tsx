import React from "react";
import ReactDOM from "react-dom";
import {useState} from 'react'
import {patchFetchPicture} from "../Fetch/patchFetchPicture"
import "./ModalChangeContent.css"
import "../../../Components/Tools/Text.css"
import "../../../Components/Tools/Box.css"

export default function ModalChangePicture({ isShowing, hide, id, up, title } : any) {

	const [content, setcontent] = useState('');
	const [url, setUrl] = useState('');

	function handleChange(event : any) {
		setcontent(event.target.value);
		setUrl("http://127.0.0.1:4200/users/" + id);
	};

	function patchAndClose(e : any)
	{
		e.preventDefault();
		const test = patchFetchPicture({url: url, picture: content});
		console.log("TEST",test);
		test.then((responseObject)=> {
			if (responseObject.status === 400)
			{
				console.log("test");
			}
			})
		hide();
		up();
	}

	return (
		isShowing
		? ReactDOM.createPortal(
			<>
			  <div className="modal-overlay">
				<div className="modal-wrapper">
				  <div className="modal2">
					<div className="modal-header">
					<div className="yellowText" style={{fontSize: "1.22em"}}> {title}</div>
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
