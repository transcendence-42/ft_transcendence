
export async function requestFriendship(props : any){

   /**
   * Sending information about a Friendship request to DB
   */
	try{
		await
		fetch(props.url, {
	  method: "PUT",
	  credentials: "include",
	  headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
		"Access-Control-Allow-Credentials": "true",
	  },
	  body: JSON.stringify({ addresseeId: props.addresseeId })
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
