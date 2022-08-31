import {Link} from 'react-router-dom'
import '../Text.css';
import '../Box.css';

function ProfilNavBar() {
	return (
		<>
		<Link to="/">
		<div className="profilBox"
		style={{
		  width: "5vw",
		  height: "5vw",
		  }}> DECO </div> 
		</Link>
		</>
	);
}

export default ProfilNavBar
