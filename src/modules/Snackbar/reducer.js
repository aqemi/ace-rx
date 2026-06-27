import {
  SNACKBAR_OPEN,
  SNACKBAR_CLOSE
} from '../../actionTypes';

export default function (state = '', action) {
  const { type, data } = action;
  switch (type) {
    case SNACKBAR_OPEN:
      return data;
    case SNACKBAR_CLOSE:
      return '';
    default:
      return state;
  }
}
