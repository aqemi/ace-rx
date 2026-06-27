import {
  LIGHTBOX_OPEN_IMAGE,
  LIGHTBOX_OPEN_VIDEO,
  LIGHTBOX_CLOSE
} from '../../actionTypes';

import { updateState } from '../../utils';

const initialState = {
  image: null,
  video: null
};

export default function (state = initialState, action) {
  const { type, data } = action;

  switch (type) {
    case LIGHTBOX_OPEN_IMAGE:
      return updateState(state, { image: data });

    case LIGHTBOX_OPEN_VIDEO:
      return updateState(state, { video: data });

    case LIGHTBOX_CLOSE:
      return initialState;

    default:
      return state;
  }
}
