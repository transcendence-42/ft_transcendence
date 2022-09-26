export async function fetchUrl(path: string, method: string, body?: any): Promise<any> {
  const response = await fetch(path, {
    method,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': 'true'
    },
    body: JSON.stringify(body)
  })
    .then((response) => {
      return response.json();
    })
    .then((respObj) => {
      console.log(`Object from fetch ${method} ${path}: ${JSON.stringify(respObj, null, 4)}`);
      return respObj;
    })
    .catch((e) =>
      console.log(`Error while fetching ${path}. Error: ${JSON.stringify(e, null, 4)}`)
    );
  return response;
}
