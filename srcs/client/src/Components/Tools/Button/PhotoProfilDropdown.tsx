import React from 'react'
import '../Text.css';
import '../Box.css';
import { Link } from "react-router-dom";

function PhotoProfilDropdown(props : any) {
  return (
    <div className="dropdown dropend" >
      <button className="profilBoxDropdown" data-bs-toggle="dropdown" aria-expanded="false" style={{
				width: props.width,
				height: props.height,
			}}>
        <img src={props.url} alt="IMG"></img>
      </button>
      <ul className="dropdown-menu dropdown-menu-dark boxBlue" aria-labelledby="dropdownMenuButton1">
        {/* <Link to="/profile">  <div className="btn textBlue" >View Profile</div> </Link> */}
        <Link state={{userID:props.id, originalId: props.originalId}} to="/profile">  <div className="btn textBlue" >View Profile</div> </Link>

    <button className="btn textBlue disabled">Spectate</button>
  </ul>
  </div>
  );
}

export default PhotoProfilDropdown;
