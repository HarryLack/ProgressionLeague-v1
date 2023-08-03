function fetchBanlist(list: string) {
  return fetch(`${__webpack_public_path__}lists/${list}.json`, { method: 'GET' }).then(async (response) => response.json())
    .then((json) => json);
}

export default fetchBanlist;
