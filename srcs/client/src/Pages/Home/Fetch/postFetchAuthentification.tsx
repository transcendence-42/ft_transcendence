export async function postFetchAuthentification(props : any){
  const apiUrl: string = process.env.REACT_APP_API_URL as string;
	const response = await
		fetch(`${apiUrl}/auth/2fa/authenticate`, {
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
