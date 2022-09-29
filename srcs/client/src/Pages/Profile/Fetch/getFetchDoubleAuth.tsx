
export async function getFetchDoubleAuth(){
	const response = await
	fetch("http://127.0.0.1:4200/auth/2fa/generate", {
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
