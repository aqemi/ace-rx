import { CONTROL_ENDPOINT } from '../../config';

export function list() {
  return fetch(`${CONTROL_ENDPOINT}&act=ban_list`, {
    credentials: 'include'
  }).then((response) => {
    if (response.status >= 400) {
      throw new Error('Bad response from server');
    }
    return response.json();
  });
}

export function banTarget({
  table, target, reason, expire
}) {
  const body = new FormData();
  body.set('table', table);
  body.set('target', target);
  if (reason) {
    body.set('reason', reason);
  }
  if (expire) {
    body.set('expire', expire);
  }

  return fetch(`${CONTROL_ENDPOINT}&act=ban_target`, {
    method: 'POST',
    credentials: 'include',
    body,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  }).then((response) => {
    if (response.status >= 400) {
      throw new Error('Bad response from server');
    }
    return response.text();
  });
}

export function unban({ table, target }) {
  const body = new FormData();
  body.set('table', table);
  body.set('target', target);

  return fetch(`${CONTROL_ENDPOINT}&act=unban`, {
    method: 'POST',
    credentials: 'include',
    body,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  }).then((response) => {
    if (response.status >= 400) {
      throw new Error('Bad response from server');
    }
    return response.text();
  });
}
