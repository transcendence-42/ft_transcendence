
export async function getFetchFriends(props : any){
   /**
   * @props url: url for the request with userID inside
   * Get the Friends informations of an user
   */
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
				return;
			}
			return (response.json());
		})
	return response;
 };

