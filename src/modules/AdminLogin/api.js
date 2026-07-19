import { CONTROL_ENDPOINT } from '../../config';

// The admin endpoint replies either with a JSON `{ msg }` envelope or a plain
// text message. Normalize both to the human-readable string.
function parseMessage(text) {
  try {
    const json = JSON.parse(text);
    return json.msg ?? text;
  } catch {
    return text;
  }
}

// Establishes the admin session cookie. On success the caller reloads the
// avatar endpoint, which is the single source of truth for `isAdmin` — we
// never trust a flag from this response.
export function login({ user, pass }) {
  const body = new FormData();
  body.set('user', user);
  body.set('pass', pass);

  return fetch(`${CONTROL_ENDPOINT}&act=login`, {
    method: 'POST',
    credentials: 'include',
    body,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  }).then(async (response) => {
    const message = parseMessage(await response.text());
    if (response.status >= 400) {
      throw new Error(message || 'Bad response from server');
    }
    return message;
  });
}
