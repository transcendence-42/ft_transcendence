export async function patchFetchPseudo(props : any): Promise<boolean> {
	return await
		fetch(props.url, {
	  method: "PATCH",
	  credentials: "include",
	  headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
		"Access-Control-Allow-Credentials": "true",
	  },
	  body: JSON.stringify({ username: props.name})
	}).then((response) => {
		console.log(response);
		if (response.status !== 200) return false;
    else return true;	
	})
}
