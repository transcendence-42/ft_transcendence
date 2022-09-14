export async function patchFetchPseudo(props : any){
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

// "http://127.0.0.1:4200/users/1"
