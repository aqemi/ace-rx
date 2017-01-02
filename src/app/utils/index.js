'use strict';

import padStart from 'lodash/padStart';
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
  const color = `hsl(${colorCode},50%,50%)`;
  return color;
}

export function getAvatar(userId) {
  return {
    color: getAvatarColor(userId),
    icon: getAvatarIcon(userId)
  };
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

export function setBackground(theme) {
  document.body.style.backgroundImage = `url(assets/background-${theme}.png)`;
}

export function getExtWebmUrl(text) {
  const match = text.match(EXT_WEBM_REGEXP);
  return match && match[0];
}

export function getExtWebmThumbnail(url) {
  return url.replace('src', 'thumb').replace('.webm', 's.jpg');
}
