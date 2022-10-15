
export async function getFetchDeactivateDoubleAuth(){
	/**
	* Deactivate 2fa
	*/
   const apiUrl: string = process.env.REACT_APP_API_URL as string;
	 const response = await
	 fetch(`${apiUrl}/auth/2fa/deactivate`, {
   method: "GET",
   credentials: "include",
   headers: {
	 Accept: "application/json",
	 "Content-Type": "application/json",
	 "Access-Control-Allow-Credentials": "true",
   }
 })
	 return response;
 }

