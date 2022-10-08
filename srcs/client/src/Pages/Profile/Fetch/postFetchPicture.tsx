
export async function postFetchPicture(props : any){

   /**
   * @props url     : url for the request with userID inside
   *        formData: information from form including the file to upload
   */
	const response = await
	fetch(props.url, {
	  method: "POST",
	  credentials: "include",
	  headers: {
    Accept: "application/json",
		"Access-Control-Allow-Credentials": "true",
	  },
	  body: props.data,
	})
	return response;
 }

