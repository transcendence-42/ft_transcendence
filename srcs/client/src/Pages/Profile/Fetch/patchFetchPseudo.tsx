export async function patchFetchPseudo(props : any){
	console.log("PROPS", props.name);
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
	  body: JSON.stringify({ username: props.name})
	}).then((response) =>{
		console.log(response);
		if (response.status === 200)
		{
				// check response for Bad Request (Waiting for API update)
			}
			else { throw new Error("Error"); }
		})
	}
	catch(error) {
		console.error(error);
 };
}
