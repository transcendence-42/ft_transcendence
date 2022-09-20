import '../Text.css';
import '../Box.css';
import { Link } from "react-router-dom";
import React, { useState } from "react";

function PhotoProfilDropdown(props : any) {

  const [userID, setuserID] = useState(props.id);

  return (
    <div className="dropdown dropend" >
      <button className="profilBoxDropdown" data-bs-toggle="dropdown" aria-expanded="false" style={{
				width: props.width,
				height: props.height,
			}}>
        <img src={props.url} alt="IMG"></img>
      </button>
      <ul className="dropdown-menu dropdown-menu-dark boxBlue" aria-labelledby="dropdownMenuButton1">
    <Link state={{userID}} to="/other_profile">  <div className="btn textBlue" >View PRO</div> </Link>
    <button className="btn textBlue disabled">Spectate</button>
    <button className="btn textBlue">View Profile</button>
    <button className="btn textBlue">Add Friend</button>
    <button className="btn textBlue">Block Friend</button>
  </ul>
  </div>
  );
}



export default PhotoProfilDropdown;


// Add .disabled to items in the dropdown to style them as disabled.

// return(
//   <div className="dropdown">
//   <button className=" btn btn-secondary dropdown-toggle profilBox" data-bs-toggle="dropdown" aria-expanded="false"
//   style={{
//     width: "2wh",
//     height: "2wh"}}>
//     Drop
//   </button>
//   <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton1">
//     <div className="textBlue">View Profile</div>
//     <div className="textBlue">Spectate</div>
//     <div className="textBlue">Add Friend</div>
//     <div className="textBlue">Block Friend</div>
//   </ul>
//   </div>
// );

