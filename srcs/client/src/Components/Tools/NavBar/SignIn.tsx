import '../Text.css';
import '../Box.css';

function SignIn() {
	const fortyTwoLogin = () => {
		window.open("http://127.0.0.1:4200/auth/42/register", "_self");
	}
	return (
		<div className="blueBox"
		style={{
		  width: "10vw",
		  height: "5vwpx",
		  }}> <div className="playFlickering"
		  		onClick={fortyTwoLogin}
				style={{cursor:"pointer"}}
			> Sign In </div> </div>
	);
}

export default SignIn
