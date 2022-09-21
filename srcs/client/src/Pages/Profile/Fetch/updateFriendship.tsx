
export async function updateFriendship(props : any){

	console.log("props.originalId", props.originalId)
	console.log("props.addresseeId", props.addresseeId)
	console.log("props.status", props.status)
	console.log("props.URL", props.url)
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
	  body: JSON.stringify({
		requesterId: props.originalId,
		addresseeId: props.addresseeId,
		status: props.status
	})
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
