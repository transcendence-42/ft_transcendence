
export async function getFetchSuccess(){

   /**
   * Check if the session cookie is valid and
   * give back information with some user informations
   */
  const apiUrl: string = process.env.REACT_APP_API_URL as string;
	const response = await
	fetch(`${apiUrl}/auth/success`, {
  method: "GET",
  credentials: "include",
  headers: {
	Accept: "application/json",
	"Content-Type": "application/json",
	"Access-Control-Allow-Credentials": "true",
  }
}).then((response) =>{
		if (response.status !== 200){
			return (response.json());
		}
		return (response.json());
	})
	return response;
};
