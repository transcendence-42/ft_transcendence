
export async function patchFetchPicture(props : any){

   /**
   * @props url: url for the request with userID inside
   * Patching the picture of an user
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
	  body: JSON.stringify({ profilePicture: props.picture})
	})
	return response;
 }

