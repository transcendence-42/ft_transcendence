
export async function getFetchSuccess(){

   /**
   * Check if the session cookie is valid and
   * give back information with some user informations
   */
	const response = await
	fetch("http://127.0.0.1:4200/auth/success", {
  method: "GET",
  credentials: "include",
  headers: {
	Accept: "application/json",
	"Content-Type": "application/json",
	"Access-Control-Allow-Credentials": "true",
  }
}).then((response) =>{
		if (response.status !== 200){
			return;
		}
		return (response.json());
	})
	return response;
};
