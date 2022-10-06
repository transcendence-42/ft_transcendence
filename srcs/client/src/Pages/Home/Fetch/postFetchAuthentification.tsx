export async function postFetchAuthentification(props : any){
	const response = await
		fetch("http://127.0.0.1:4200/auth/2fa/authenticate", {
	  method: "POST",
	  credentials: "include",
	  headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
		"Access-Control-Allow-Credentials": "true",
	  },
	  body: JSON.stringify({ code: props.keyGen})
	})
	return response;
}
