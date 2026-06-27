import {
  LOAD_TOPIC,
  SET_ONLINE_COUNTER
} from '../../actionTypes';

import { updateState } from '../../utils';

const initialState = {
  topic: '',
  online: '0'
};

export default function (state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case LOAD_TOPIC:
      return updateState(state, { topic: data });
    case SET_ONLINE_COUNTER:
      return updateState(state, { online: data });
    default:
      return state;
  }
}
