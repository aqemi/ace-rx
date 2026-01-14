'use strict';

import { PLAYLIST_ENDPOINT, CONTROL_ENDPOINT } from '../../config';

export function load() {
  return fetch(PLAYLIST_ENDPOINT, {
    credentials: 'include'
  })
    .then((response) => {
      if (response.status >= 400) {
        throw new Error('Bad response from server');
      }
      return response.json();
    });
}

export function upload(file, onProgress) {
  const body = new FormData();
  body.set('added', file, file.name);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('post', `${PLAYLIST_ENDPOINT}&act=add`);
    xhr.onload = e => resolve(e.target.responseText);
    xhr.onerror = reject;
    xhr.upload.onprogress = onProgress;
    xhr.send(body);
  });
}

export function vote(id, value) {
  const body = new FormData();
  body.set('id', id);
  body.set('val', value);
  return fetch(`${PLAYLIST_ENDPOINT}&act=vote`, {
    method: 'post',
    credentials: 'include',
    body
  })
    .then((response) => {
      if (response.status >= 400) {
        throw new Error('Bad response from server');
      }
      return response.text();
    });
}

export function edit(id, artist, title) {
  const body = new FormData();
  body.set('id', id);
  body.set('artist', artist);
  body.set('title', title);

  return fetch(`${PLAYLIST_ENDPOINT}&act=edit`, {
    method: 'post',
    credentials: 'include',
    body
  })
    .then((response) => {
      if (response.status >= 400) {
        throw new Error('Bad response from server');
      }
      return response.text();
    });
}

export function deleteSong(id) {
  const body = new FormData();
  body.set('ids', id);

  return fetch(`${CONTROL_ENDPOINT}&act=delsong`, {
    method: 'post',
    credentials: 'include',
    body,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
    .then((response) => {
      if (response.status >= 400) {
        throw new Error('Bad response from server');
      }
      return response.text();
    });
}
