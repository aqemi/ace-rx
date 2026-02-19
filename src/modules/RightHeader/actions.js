'use strict';

import { LOAD_TOPIC } from '../../actionTypes';

import * as api from './api';

export function loadTopic() {
  return async (dispatch) => {
    try {
      if (document.referrer) {
        await api.reportMetrics({ referer: document.referrer });
      }
      const data = await api.loadTopic();
      dispatch({ type: LOAD_TOPIC, data: data.topic });
    } catch (error) {
      console.error(error);
    }
  };
}
