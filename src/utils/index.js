'use strict';

import padStart from 'lodash/padStart';
import once from 'lodash/once';
import _isMobile from 'is-mobile';
import { EXT_WEBM_REGEXP } from '../constants';

export function padTime(time) {
  return padStart(time, 2, '0');
}

export function getAvatarIcon(userId = '') {
  const charCode = (parseInt(userId.slice(-2), 16) % 25) + 65;
  return String.fromCharCode(charCode);
}

export function getAvatarColor(userId = '') {
  const colorCode = parseInt(userId.slice(-3), 16) % 360;
  return `hsl(${colorCode},50%,50%)`;
}

export function updateState(prevState, nextState) {
  return Object.assign({}, prevState, nextState);
}

export function fixMimeType(filename, data) {
  if (!data.match(/data:image\/.+?;base64/)) {
    let ext = filename.split('.').pop();
    if (ext === 'jpg') ext = 'jpeg';
    return data.replace('data:base64', `data:image/${ext};base64`);
  }
  return data;
}

export function getExtWebmUrl(text) {
  const match = text.match(EXT_WEBM_REGEXP);
  return match && match[0];
}

export function getExtWebmThumbnail(url) {
  return url.replace('src', 'thumb').replace(/\.(webm|mp4)/, 's.jpg');
}

export const isMobile = once(_isMobile);

export function formatDate(date) {
  const formatter = new Intl.DateTimeFormat('ru-Ru', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return formatter.format(date);
}

