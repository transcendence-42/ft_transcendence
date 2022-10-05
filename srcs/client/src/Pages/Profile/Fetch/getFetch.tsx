export async function getFetch(props: any) {
  /**
   * @props url: url for the request
   * Generic function for GET Fetch
   */
  try {
    const response = await fetch(props.url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
      },
    })
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        console.log(error);
      });
    return response;
  } catch (error) {
    console.error(error);
  }
}
