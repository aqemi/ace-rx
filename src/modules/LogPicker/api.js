'use strict';

import { LOG_ENDPOINT } from '../../config';

export function loadEarliest() {
  return fetch(`${LOG_ENDPOINT}&act=earliest`)
    .then((response) => {
      if (response.status >= 400) {
        throw new Error('Bad response from server');
      }
      return response.json();
    });
}
