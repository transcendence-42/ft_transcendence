import { User, Channel, UserOnChannel } from "./entities/user.entity";

export async function fetchUrl(
  path: string,
  method: string = "GET",
  body?: any
): Promise<any> {
  const response = await fetch(path, {
    method,
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": "true"
    },
    body: JSON.stringify(body)
  })
    .then((response) => {
      if (response.status === 204) return {};
      return response.json();
    })
    .then((respObj) => {
      if (isEmpty(respObj)) {
        return null;
      }
      return respObj;
    })
    .catch((e) => null);
  return response;
}

export const isEmpty = (obj: any) => {
  for (const i in obj) return false;
  return true;
};

export const otherUser = (
  channelId: number,
  allChannels,
  userChannels,
  userId,
  allUsers
): User | undefined => {
  if (
    isEmpty(allChannels) ||
    isEmpty(userChannels) ||
    isEmpty(allUsers) ||
    !channelId ||
    !userId
  ) {
    // console.log(`other user returning nothing because is empty`);
    return;
  }
  const channel = allChannels.find((chan) => chan.id === channelId);
  if (!channel) {
    // console.log(`other user returning nothing beccause channel not found`);
    return;
  }

  const otherUserOnChannel = channel.users.find((usr) => usr.userId !== userId);
  if (!otherUserOnChannel) {
    // console.log(
    //   `other user returning nothing because otherUserOnChannel not found in all channels`
    // );
    return;
  }
  // console.log(`other user returning ${allUsers[otherUserOnChannel.userId]}`)
  return allUsers[otherUserOnChannel.userId];
};
export const getChannel = (channelId, allChannels) => {
  return allChannels.find((chan: Channel) => chan.id === channelId);
};

export const getUserOnChannel = (userId, users: UserOnChannel[]) => {
  return users.find((usr) => usr.userId === userId);
};
