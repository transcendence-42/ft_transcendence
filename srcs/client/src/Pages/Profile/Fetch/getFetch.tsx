
export async function getFetch(props : any){

    /**
   * @props url: url for the request
   * Generic function for GET Fetch
   */
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
				throw new Error("Error");
			}
			return (response.json());
		})
		return response;
	}
	catch(error) {
		console.error(error);
 };
}
