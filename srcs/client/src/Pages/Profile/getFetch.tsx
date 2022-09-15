
export async function getFetch(props : any){
	try{
		const response = await
		fetch(props.url, {
	  method: "GET",
	  credentials: "include",
	  headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
		"Access-Control-Allow-Credentials": "true",
	  }
	}).then((response) =>{
			if (response.status !== 200){
				// return no friend
				throw new Error("Error");
			}
			return (response.json());
		})
		return response;
	}
	catch(error) { // Mettre un potentiel message d'erreur ?
		console.error(error);
 };
}
