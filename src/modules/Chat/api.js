import { CHAT_ENDPOINT, CONTROL_ENDPOINT, LOG_ENDPOINT } from '../../config';
import { getTurnstileToken, isTokenNeeded, setTokenNeeded } from '../../utils/turnstile';

export function load(lastMessageId) {
  return fetch(`${CHAT_ENDPOINT}&last=${lastMessageId}`, {
    credentials: 'include'
  }).then((response) => {
    if (response.status >= 400) {
      throw new Error('Bad response from server');
    }
    return response.json();
  });
}

function sendPost(message, file, avatar, turnstileToken) {
  const formdata = new FormData();
  formdata.append('text', encodeURIComponent(message));
  if (file) {
    formdata.append('filedata', file);
  }
  if (avatar) {
    formdata.append('avatar', avatar);
  }
  if (turnstileToken) {
    formdata.append('cf-turnstile-response', turnstileToken);
  }

  return fetch(`${CHAT_ENDPOINT}&act=post`, {
    method: 'POST',
    body: formdata,
    credentials: 'include'
  }).then((response) => {
    if (response.status >= 400) {
      throw new Error('Bad response from server');
    }
    return response.text();
  });
}

// A 'captcha' response means the server wants a fresh Turnstile token. Detect it
// so we can mint one and retry, without treating it as a normal error alert.
function isCaptchaResponse(text) {
  try {
    return JSON.parse(text).type === 'captcha';
  } catch {
    return false;
  }
}

export async function post(message, file, avatar) {
  // Only mint a token when the server currently requires one (fresh session or
  // after the server's session trust expired). Otherwise post token-less.
  const token = isTokenNeeded() ? await getTurnstileToken() : '';
  let text = await sendPost(message, file, avatar, token);

  // Server rejected with a captcha challenge: solve once and retry.
  if (isCaptchaResponse(text)) {
    setTokenNeeded(true);
    const retryToken = await getTurnstileToken();
    text = await sendPost(message, file, avatar, retryToken);

    // Still challenged after a fresh token: give up (no further retries) and
    // surface a clear message instead of leaking the raw challenge response.
    if (isCaptchaResponse(text)) {
      throw new Error('Turnstile verification failed');
    }
  }

  // Post accepted (or a non-captcha error): the session is now trusted, so
  // subsequent posts skip the token until the server challenges again.
  setTokenNeeded(false);

  return text;
}

export async function control(method, messageId, params = {}) {
  const formdata = new FormData();
  formdata.append('id', messageId);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null) {
      formdata.append(key, value);
    }
  });

  const response = await fetch(`${CONTROL_ENDPOINT}&act=${method}`, {
    credentials: 'include',
    method: 'POST',
    body: formdata,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  });
  if (response.status >= 400) {
    throw new Error('Bad response from server');
  }
  const json = await response.json();
  return json.msg;
}

export function loadLog(date) {
  const d = new Date(date);
  const formattedDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return fetch(`${LOG_ENDPOINT}&log=${formattedDate}&timezone=${encodeURIComponent(tz)}`, {
    credentials: 'include'
  }).then((response) => response.text());
}
