'use strict';

import {
  SHOW_PREVIEW,
  HIDE_PREVIEW
} from '../../actionTypes';

const initialState = {
  messageId: null,
  visible: false
};

export default function (state = initialState, action) {
  const { type, data } = action;

  switch (type) {
    case SHOW_PREVIEW:
      return { messageId: data, visible: true };
    case HIDE_PREVIEW:
      return { ...state, visible: false };
    default:
      return state;
  }
}
