'use strict';

import { CHAT_ENDPOINT, CONTROL_ENDPOINT, LOG_ENDPOINT } from '../../config';

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

export function post(message, file) {
  const formdata = new FormData();
  formdata.append('text', encodeURIComponent(message));
  if (file) {
    formdata.append('filedata', file);
  }

  return fetch(`${CHAT_ENDPOINT}&act=post`, {
    method: 'POST',
    body: formdata,
    credentials: 'include'
  }).then(response => response.text());
}

export async function control(method, messageId, params = {}) {
  const formdata = new FormData();
  formdata.append('id', messageId);
  Object.entries(params).forEach(([key, value]) => {
    if (value != null) formdata.append(key, value);
  });

  const response = await fetch(`${CONTROL_ENDPOINT}&act=${method}`, {
    credentials: 'include',
    method: 'POST',
    body: formdata,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  });
  const json = await response.json();
  return json.msg;
}

export function loadLog(date) {
  const d = new Date(date);
  const formattedDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  return fetch(`${LOG_ENDPOINT}&log=${formattedDate}`, {
    credentials: 'include'
  }).then(response => response.json());
}
