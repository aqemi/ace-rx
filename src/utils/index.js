'use strict';

import { hslToRgb, rgbToHex } from '@mui/material';
import isMobile from 'is-mobile';
import { EXT_WEBM_REGEXP } from '../constants';

export function padTime(time) {
  return String(time).padStart(2, '0');
}

export function getAvatarIcon(userId = '') {
  const charCode = (parseInt(userId.slice(-2), 16) % 25) + 65;
  return String.fromCharCode(charCode);
}

export function getAvatarColor(userId = '') {
  const colorCode = parseInt(userId.slice(-3), 16) % 360;
  const hsl = `hsl(${colorCode},50%,50%)`;
  return rgbToHex(hslToRgb(hsl));
}

export function getShiftedAvatarColor(userId = '', hueShift = 60) {
  const colorCode = parseInt(userId.slice(-3), 16) % 360;
  const shifted = (colorCode + hueShift) % 360;
  const hsl = `hsl(${shifted},50%,50%)`;
  return rgbToHex(hslToRgb(hsl));
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

export const union = (...arrays) => [...new Set(arrays.filter(Boolean).flat())];

export const unionBy = (a, b, key) => {
  const map = new Map(a.map((item) => [item[key], item]));
  b.forEach((item) => map.set(item[key], item));
  return [...map.values()];
};

const once = (fn) => {
  let result;
  return (...args) => (result ??= fn(...args));
};

const isMobileCached = once(isMobile);

export { isMobileCached as isMobile };

export function getRandomIndex(length, excludeIndex) {
  if (length <= 1) return 0;
  let r;
  do {
    r = Math.floor(Math.random() * length);
  } while (r === excludeIndex);
  return r;
}

export function formatDate(date) {
  const formatter = new Intl.DateTimeFormat('ru-Ru', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return formatter.format(date);
}
