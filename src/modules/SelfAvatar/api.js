import { AVATAR_ENDPOINT } from '../../config';

export function load() {
  return fetch(AVATAR_ENDPOINT, {
    credentials: 'include'
  }).then((response) => {
    if (response.status >= 400) {
      throw new Error('Bad response from server');
    }
    return response.json();
  });
}
