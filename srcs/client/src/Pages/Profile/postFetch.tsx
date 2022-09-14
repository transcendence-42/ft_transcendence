
export async function postFetch(){
	console.log("postFetch");
	try{
		await
		fetch("http://127.0.0.1:4200/users", {
	  method: "POST",
	  credentials: "include",
	  headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
		"Access-Control-Allow-Credentials": "true",
	  },
	  body: JSON.stringify({ username: 'Tintin', email: "tintindu93@haddock.fr",
	  profilePicture: "https://media.routard.com/image/28/4/new-york-aerial.1515284.w630.jpg" })
	}).then((response) =>{
			if (response.status !== 200){
				console.error(response.status);
				throw new Error("Error");
			}
		})
	}
	catch(error) {
		console.error(error);
 };
}
