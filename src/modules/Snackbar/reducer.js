import {
  SNACKBAR_OPEN,
  SNACKBAR_CLOSE
} from '../../actionTypes';

export default function (state = null, action) {
  const { type, data } = action;
  switch (type) {
    case SNACKBAR_OPEN:
      return typeof data === 'string' ? { message: data } : data;
    case SNACKBAR_CLOSE:
      return null;
    default:
      return state;
  }
}
