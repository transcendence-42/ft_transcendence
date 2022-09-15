import {Link} from 'react-router-dom'
import '../Text.css';
import '../Box.css';

function SignIn() {

	return (
		<>
		<Link to="/login">
		<div className="blueBox"
		style={{
		  width: "10vw",
		  height: "5vwpx",
		  }}> <div className="playFlickering"
				style={{cursor:"pointer"}}
			> Sign In </div> </div>
		</Link>
		</>
	);
}


export default SignIn
