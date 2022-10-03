import { User, Channel } from "./entities/user.entity";

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
      return response.json();
    })
    .then((respObj) => {
      return respObj;
    })
    .catch((e) =>
      console.log(
        `Error while fetching ${path}. Error: ${JSON.stringify(e, null, 4)}`
      )
    );
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
    console.group("otherUser");
    console.log(`This is channel id ${channelId}`);
    console.log(`This is allChannels ${JSON.stringify(allChannels)}`);
    console.log(`This is userChannels ${JSON.stringify(userChannels)}`);
    console.log(`This is user id ${userId}`);
    console.log(`This is allUsers ${JSON.stringify(allUsers)}`);
    console.groupEnd();
    return;
  }
  const channel = allChannels.find((chan) => chan.id === channelId);
  console.log(
    `this is the channel i found inside otherUse ${JSON.stringify(channel)}`
  );
  if (!channel) return;
  const otherUserOnChannel = channel.users.find((usr) => usr.userId !== userId);
  console.log(
    `This is the otherUserOnChannel ${JSON.stringify(otherUserOnChannel)}`
  );
  if (!otherUserOnChannel) return;
  return allUsers[otherUserOnChannel.userId];
};
export const findChannel = (channelId, allChannels) => {
  return allChannels.find((chan: Channel) => chan.id === channelId);
};
