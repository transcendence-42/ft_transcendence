export async function patchFetchUsername(props : any){

   /**
   * @props url: url for the request with userID inside
   * Patching the username of an user
   */
	const response = await
		fetch(props.url, {
	  method: "PATCH",
	  credentials: "include",
	  headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
		"Access-Control-Allow-Credentials": "true",
	  },
	  body: JSON.stringify({ username: props.name})
	})
	return response;
}
