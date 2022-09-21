
export async function getFetchFriends(props : any){
	// console.log("URL ",props.url);

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
				return; //No friend
			}
			return (response.json());
		})
	return response;
 };

