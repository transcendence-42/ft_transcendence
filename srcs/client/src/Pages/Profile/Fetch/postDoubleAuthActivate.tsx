export async function postDoubleAuthActivate(props : any){
	const response = await
		fetch("http://127.0.0.1:4200/auth/2fa/activate", {
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
