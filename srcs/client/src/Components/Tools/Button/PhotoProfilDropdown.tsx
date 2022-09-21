import '../Text.css';
import '../Box.css';
import { Link } from "react-router-dom";

function PhotoProfilDropdown(props : any) {

	console.log("ADDFRIEND USER ID", props.id)
	console.log("ADDFRIEND VIEWER ID", props.originalId)

  return (
    <div className="dropdown dropend" >
      <button className="profilBoxDropdown" data-bs-toggle="dropdown" aria-expanded="false" style={{
				width: props.width,
				height: props.height,
			}}>
        <img src={props.url} alt="IMG"></img>
      </button>
      <ul className="dropdown-menu dropdown-menu-dark boxBlue" aria-labelledby="dropdownMenuButton1">
        <Link state={{userID:props.id, originalId: props.originalId}} to="/profile">  <div className="btn textBlue" >View Profile</div> </Link>

    <button className="btn textBlue disabled">Spectate</button>
  </ul>
  </div>
  );
}



export default PhotoProfilDropdown;


// { props.id === props.originalId ?
//   <Link state={{userID:props.id, originalId: props.originalId}} to="/profile">  <div className="btn textBlue" >View Profile</div> </Link> :
//   <Link state={{userID:props.id, originalId: props.originalId}} to="/other_profile">  <div className="btn textBlue" >View Profile</div> </Link>
// }

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

