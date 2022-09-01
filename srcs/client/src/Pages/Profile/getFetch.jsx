
export async function getFetch(props){
	try{
		const response = await
		fetch(props.url, {
	  method: "GET",
	  credentials: "include",
	//   redirect: "follow",
	  headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
		"Access-Control-Allow-Credentials": "true",
	  }
	}).then((response) =>{
			if (response.status !== 200){
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
