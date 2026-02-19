'use strict';

import {
  SHOW_PREVIEW,
  HIDE_PREVIEW
} from '../../actionTypes';

export function showPreview(id) {
  return { type: SHOW_PREVIEW, data: id };
}

export function hidePreview() {
  return { type: HIDE_PREVIEW };
}
