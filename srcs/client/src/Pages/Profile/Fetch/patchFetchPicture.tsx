
export async function patchFetchPicture(props : any){
	try{
		await
		fetch(props.url, {
	  method: "PATCH",
	  credentials: "include",
	  headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
		"Access-Control-Allow-Credentials": "true",
	  },
	  body: JSON.stringify({ profilePicture: props.picture})
	}).then((response) =>{
		console.log(response);
		if(response.status !== 200)
			throw new Error("Error")
		})
	}
	catch(error) {
		console.error(error);
		return false;
 };
}
