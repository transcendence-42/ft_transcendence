export async function updateFriendship(props: any) {
  /**
   * Sending information about a Friendship update to DB
   */
  try {
    await fetch(props.url, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
      },
      body: JSON.stringify({
        requesterId: props.requesterId,
        addresseeId: props.addresseeId,
        status: props.status,
      }),
    }).then((response) => {
      if (response.status !== 200) {
        // console.error(response.status);
        throw new Error('Error');
      }
    });
  } catch (error) {
    // console.error(error);
  }
}
