'use strict';

import {
  POSTAREA_SET_UPLOADING,
  POSTAREA_SET_MESSAGE,
  POSTAREA_INSERT_REPLY
} from '../../actionTypes';

import { updateState } from '../../utils';

const initialState = {
  message: '',
  processing: false
};

export default function (state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case POSTAREA_SET_UPLOADING:
      return updateState(state, {
        processing: data
      });
    case POSTAREA_SET_MESSAGE:
      return updateState(state, {
        message: data
      });
    case POSTAREA_INSERT_REPLY: {
      const prefix = state.message.endsWith('\n') || !state.message ? '' : ' ';
      return updateState(state, {
        message: `${state.message + prefix + data} `
      });
    }
    default:
      return state;
  }
}
