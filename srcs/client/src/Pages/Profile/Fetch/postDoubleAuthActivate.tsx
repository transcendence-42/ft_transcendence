export async function postDoubleAuthActivate(props : any){

   /**
   * Sending information of the 2fa Status to DB
   */
  const apiUrl: string = process.env.REACT_APP_API_URL as string;
	const response = await
		fetch(`${apiUrl}/auth/2fa/activate`, {
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
