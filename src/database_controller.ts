
async function requestToBackend(urlPath: string) {
  let uri = encodeURI(urlPath);
  let response = await fetch(`http://localhost:8000/${uri}`);
  return await response.json();
}

export async function fetchChannels() {
  let url = 'channels';
  return requestToBackend(url);
}

export async function fetchMembers() {
  let url = 'members';
  return requestToBackend(url);
}

export async function fetchMessages(chanID: string, lastMessID: string) {
  let url = `channels/${chanID}/${lastMessID}`;
  return requestToBackend(url);
}

export async function searchMessages(query: string) {
  let url = `/messages/${query}`;
  return requestToBackend(url);
}