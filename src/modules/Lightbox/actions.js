import {
  LIGHTBOX_OPEN_IMAGE,
  LIGHTBOX_OPEN_VIDEO,
  LIGHTBOX_CLOSE
} from '../../actionTypes';

export function openImage(data) {
  return { type: LIGHTBOX_OPEN_IMAGE, data };
}

export function openVideo(data) {
  return { type: LIGHTBOX_OPEN_VIDEO, data };
}

export function close() {
  return { type: LIGHTBOX_CLOSE };
}
